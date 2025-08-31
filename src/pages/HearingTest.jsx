import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const frequencies = [250, 500, 1000, 2000, 4000, 8000]; // Hz
const ears = ["left", "right"];
const minGain = -70;
const maxGain = 0;
const step = 5;
const intensities = Array.from(
  { length: (maxGain - minGain) / step + 1 },
  (_, i) => minGain + i * step
);

export default function AudiometryTest() {
  const navigate = useNavigate();

  const [currentEarIndex, setCurrentEarIndex] = useState(0);
  const [currentFreqIndex, setCurrentFreqIndex] = useState(0);
  const [currentIntensityIndex, setCurrentIntensityIndex] = useState(0);
  const [results, setResults] = useState({ left: {}, right: {} });
  const [isPlaying, setIsPlaying] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  // --- Tone generator ---
  const playTone = (freq, dbHL, ear) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const panNode = new StereoPannerNode(ctx, {
        pan: ear === "left" ? -1 : 1,
      });

      gainNode.gain.value = Math.pow(10, dbHL / 20);
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gainNode).connect(panNode).connect(ctx.destination);
      osc.start();

      setTimeout(() => {
        try {
          osc.stop();
          ctx.close();
        } catch {}
      }, 1000);
    } catch (err) {
      alert("Audio error. Please check your headphones.");
    }
  };

  // --- Helpers ---
  const normalizeToHL = (val) => {
    if (val === undefined || val === null) return 100;
    if (val === 100) return 100;
    if (val < 0) return 0;
    return Math.min(100, Math.abs(val));
  };

  const earAvgHL = (ear) => {
    const vals = frequencies.map((f) => normalizeToHL(results[ear][f]));
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round((sum / vals.length) * 10) / 10;
  };

  const mapAvgDbToScore = (avg) => {
    if (avg <= 20) return 10;
    if (avg <= 40) return 8;
    if (avg <= 55) return 6;
    if (avg <= 70) return 4;
    if (avg <= 90) return 2;
    return 1;
  };

  const earConditionText = (avg) => {
    if (avg <= 20) return "Normal hearing";
    if (avg <= 40) return "Mild hearing loss";
    if (avg <= 55) return "Moderate hearing loss";
    if (avg <= 70) return "Moderately-severe hearing loss";
    if (avg <= 90) return "Severe hearing loss";
    return "Profound hearing loss";
  };

  const earAdviceText = (avg) => {
    if (avg <= 20) return "✅ No action needed — just monitor over time.";
    if (avg <= 40)
      return "ℹ️ Monitor hearing; consider checkup if issues persist.";
    if (avg <= 55)
      return "🔍 Full evaluation recommended; hearing aids may help.";
    if (avg <= 70)
      return "🎧 Strongly consider hearing aids and audiologist visit.";
    if (avg <= 90) return "⚠️ Hearing aids likely beneficial; consult soon.";
    return "🚨 Urgent: specialist evaluation required.";
  };

  const asymmetryFlag = () =>
    Math.abs(earAvgHL("left") - earAvgHL("right")) >= 15;

  // --- Test controls ---
  const playCurrentTone = () => {
    if (isPlaying || testComplete) return;
    setIsPlaying(true);
    playTone(
      frequencies[currentFreqIndex],
      intensities[currentIntensityIndex],
      ears[currentEarIndex]
    );
    setTimeout(() => setIsPlaying(false), 1100);
  };

  const recordHeard = () => {
    const ear = ears[currentEarIndex];
    const freq = frequencies[currentFreqIndex];
    const dbHL = intensities[currentIntensityIndex];
    setResults((prev) => ({
      ...prev,
      [ear]: { ...prev[ear], [freq]: dbHL },
    }));
    nextStep();
  };

  const recordNotHeard = () => {
    if (currentIntensityIndex < intensities.length - 1) {
      setCurrentIntensityIndex((i) => i + 1);
      setTimeout(() => playCurrentTone(), 60);
    } else {
      const ear = ears[currentEarIndex];
      const freq = frequencies[currentFreqIndex];
      setResults((prev) => ({
        ...prev,
        [ear]: { ...prev[ear], [freq]: 100 },
      }));
      nextStep();
    }
  };

  const nextStep = () => {
    if (currentFreqIndex < frequencies.length - 1) {
      setCurrentFreqIndex((i) => i + 1);
      setCurrentIntensityIndex(0);
      setTimeout(
        () =>
          playTone(
            frequencies[currentFreqIndex + 1],
            intensities[0],
            ears[currentEarIndex]
          ),
        100
      );
    } else if (currentEarIndex < ears.length - 1) {
      setCurrentEarIndex((i) => i + 1);
      setCurrentFreqIndex(0);
      setCurrentIntensityIndex(0);
      setTimeout(
        () =>
          playTone(frequencies[0], intensities[0], ears[currentEarIndex + 1]),
        300
      );
    } else {
      setTestComplete(true);
    }
  };

  // --- Save results to localStorage on completion ---
  useEffect(() => {
    if (testComplete) {
      const newResult = {
        date: new Date().toLocaleString(),
        leftAvg: earAvgHL("left"),
        rightAvg: earAvgHL("right"),
        leftCondition: earConditionText(earAvgHL("left")),
        rightCondition: earConditionText(earAvgHL("right")),
      };
      const existing = JSON.parse(localStorage.getItem("hearingResults")) || [];
      localStorage.setItem(
        "hearingResults",
        JSON.stringify([...existing, newResult])
      );
    }
  }, [testComplete]);

  // --- Chart ---
  const chartYValue = (val) => {
    if (val === undefined || val === null) return null;
    if (val === 100) return 100;
    if (val < 0) return 0;
    return Math.min(100, Math.abs(val));
  };

  const chartData = {
    labels: frequencies.map((f) => `${f} Hz`),
    datasets: [
      {
        label: "Left Ear",
        data: frequencies.map((f) => chartYValue(results.left[f])),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
      },
      {
        label: "Right Ear",
        data: frequencies.map((f) => chartYValue(results.right[f])),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">
          Audiometry Hearing Test
        </h1>

        {!testComplete ? (
          <div className="bg-white shadow-lg rounded-xl p-6 text-center space-y-4">
            <p className="text-gray-700">
              Ear:{" "}
              <span className="font-semibold text-green-500">
                {ears[currentEarIndex]}
              </span>{" "}
              | Frequency:{" "}
              <span className="font-semibold">
                {frequencies[currentFreqIndex]} Hz
              </span>{" "}
              | Intensity:{" "}
              <span className="font-semibold">
                {intensities[currentIntensityIndex]} dB HL
              </span>
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
                onClick={playCurrentTone}
                disabled={isPlaying}
              >
                ▶ Play Tone
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
                onClick={recordHeard}
              >
                👍 Heard
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow"
                onClick={recordNotHeard}
              >
                👎 Not Heard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-green-50 border border-green-300 text-green-700 font-medium rounded-lg p-4 text-center mb-6">
              ✅ Test Completed Successfully
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/results")}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl shadow hover:bg-primary-700 transition"
              >
                View Results
              </button>
            </div>
          </>
        )}

        {/* Chart */}
        <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Audiogram</h2>
          <Line
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  reverse: true,
                  title: { display: true, text: "dB HL" },
                  min: 0,
                  max: 100,
                },
                x: { title: { display: true, text: "Frequency (Hz)" } },
              },
            }}
          />
        </div>

        {/* Post-test Summary */}
        {testComplete && (
          <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              Post-Test Summary & Recommendations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Ear */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  Left Ear
                </h3>
                <p>
                  Avg (dB HL): <b>{earAvgHL("left")}</b>
                </p>
                <p>
                  Score (1–10): <b>{mapAvgDbToScore(earAvgHL("left"))}</b>
                </p>
                <p className="mb-2">
                  Condition:{" "}
                  <span className="font-semibold">
                    {earConditionText(earAvgHL("left"))}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {earAdviceText(earAvgHL("left"))}
                </p>
              </div>

              {/* Right Ear */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold text-red-600 mb-2">
                  Right Ear
                </h3>
                <p>
                  Avg (dB HL): <b>{earAvgHL("right")}</b>
                </p>
                <p>
                  Score (1–10): <b>{mapAvgDbToScore(earAvgHL("right"))}</b>
                </p>
                <p className="mb-2">
                  Condition:{" "}
                  <span className="font-semibold">
                    {earConditionText(earAvgHL("right"))}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  {earAdviceText(earAvgHL("right"))}
                </p>
              </div>
            </div>

            {asymmetryFlag() && (
              <p className="text-red-600 font-medium mt-6 text-center">
                ⚠️ Significant asymmetry between ears (≥15 dB). Professional
                evaluation strongly recommended.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

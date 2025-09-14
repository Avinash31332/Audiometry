import React, { useState, useEffect, useRef } from "react";
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
const minGain = 0; // dB HL
const maxGain = 70; // dB HL
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

  // refs for audio nodes & analyser (to visualize waveform)
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Web Audio API tone player ---
  const playTone = (freq, dbHL, ear) => {
    // Notes on calibration:
    // - This mapping is *relative* and for demo/testing. Real dBHL -> amplitude calibration
    //   requires measurement with hardware and reference levels.
    // - Here we map dbHL (0..maxGain) to amplitude roughly on a 60-70 dB span:
    //   amplitude = 10^((dbHL - maxGain)/20) so that:
    //     dbHL = maxGain  => amplitude = 1
    //     dbHL = 0        => amplitude ~ 10^(-maxGain/20)
    //   You can change `maxGain` or the formula if you need different loudness scaling.
    try {
      // create or reuse AudioContext
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error("Web Audio API not supported");

      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;

      // resume if suspended (user gesture needed — your Play button is a gesture)
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // oscillator -> gain -> panner -> destination
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const panNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null; // fallback if not supported

      // waveform: sine
      osc.type = "sine";
      osc.frequency.value = freq;

      // map dbHL -> linear amplitude (arbitrary calibration)
      // amplitude = 10^((dbHL - maxGain)/20)
      const amplitude = Math.pow(10, (dbHL - maxGain) / 20);
      // tiny safeguard
      gainNode.gain.value = Math.max(0, amplitude);

      // pan: left = -1, right = +1 (if stereo panner available)
      if (panNode) {
        panNode.pan.value = ear === "left" ? -1 : 1;
        osc.connect(gainNode).connect(panNode).connect(ctx.destination);
      } else {
        osc.connect(gainNode).connect(ctx.destination);
      }

      // Setup analyser for waveform preview
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      // insert analyser before destination to observe the signal
      if (panNode) {
        gainNode.disconnect();
        gainNode.connect(analyser);
        analyser.connect(panNode);
        panNode.connect(ctx.destination);
      } else {
        gainNode.disconnect();
        gainNode.connect(analyser);
        analyser.connect(ctx.destination);
      }

      osc.start();

      // draw waveform while playing
      drawWaveform();

      // stop after 1s
      setTimeout(() => {
        try {
          osc.stop();
          // cleanup analyser/raf
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
          // disconnect nodes
          try {
            osc.disconnect();
            gainNode.disconnect();
            if (panNode) panNode.disconnect();
            if (analyser) analyser.disconnect();
          } catch (e) {}
          // keep audioCtx alive for reuse (don't close to avoid user gesture requirement repeatedly)
        } catch (e) {}
      }, 1000);
    } catch (err) {
      console.error("Audio error:", err);
      alert(
        "Audio error. Please check your headphones and browser support for Web Audio API."
      );
    }
  };

  // draw waveform on canvas using analyserRef
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const ctx2d = canvas ? canvas.getContext("2d") : null;
    if (!canvas || !analyser || !ctx2d) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx2d.fillStyle = "rgba(255,255,255,0)";
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);

      ctx2d.lineWidth = 2;
      ctx2d.strokeStyle = "#111827"; // dark line

      ctx2d.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0..2
        const y = (v * canvas.height) / 2;
        if (i === 0) {
          ctx2d.moveTo(x, y);
        } else {
          ctx2d.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx2d.lineTo(canvas.width, canvas.height / 2);
      ctx2d.stroke();
    };

    // start drawing
    if (!rafRef.current) draw();
  };

  // --- Helpers ---
  const normalizeToHL = (val) => {
    if (val === undefined || val === null) return 100;
    if (val === 100) return 100;
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
    // play tone with WebAudio API
    playTone(
      frequencies[currentFreqIndex],
      intensities[currentIntensityIndex],
      ears[currentEarIndex]
    );
    // stop playing flag after tone duration + small buffer
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

  // --- Chart data ---
  const makeChartData = (ear, color) => ({
    labels: frequencies.map((f) => `${f} Hz`),
    datasets: [
      {
        label: `${ear} ear`,
        data: frequencies.map((f) => normalizeToHL(results[ear][f])),
        borderColor: color,
        backgroundColor: color,
        tension: 0.2,
        pointRadius: 6,
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
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

            {/* Waveform preview canvas */}
            <div className="mt-4 flex justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={80}
                className="border rounded"
                style={{ width: "100%", maxWidth: 600 }}
              />
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
                className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition cursor-pointer"
              >
                View Results
              </button>
            </div>
          </>
        )}

        {/* Separated Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Left Ear Audiogram
            </h2>
            <Line
              data={makeChartData("left", "#3b82f6")}
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

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Right Ear Audiogram
            </h2>
            <Line
              data={makeChartData("right", "#ef4444")}
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

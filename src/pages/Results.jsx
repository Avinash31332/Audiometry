import React, { useEffect, useState } from "react";

export default function Results() {
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hearingResults")) || [];
    setAllResults(stored);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-6 py-12">
      <h1 className="text-3xl font-bold text-primary-700 mb-8 text-center">
        Your Test Results
      </h1>

      {allResults.length === 0 ? (
        <p className="text-center text-gray-600">
          No results yet. Take a hearing test first.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {allResults.map((res, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Test {idx + 1}</h2>
              <p>
                <b>Date:</b> {res.date}
              </p>
              <p>
                <b>Left Ear Avg:</b> {res.leftAvg} dB HL
              </p>
              <p>
                <b>Right Ear Avg:</b> {res.rightAvg} dB HL
              </p>
              <p>
                <b>Left Ear Condition:</b> {res.leftCondition}
              </p>
              <p>
                <b>Right Ear Condition:</b> {res.rightCondition}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

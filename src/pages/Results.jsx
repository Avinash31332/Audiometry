import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function Results() {
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hearingResults")) || [];
    setAllResults(stored);
  }, []);

  // Delete one test
  const handleDelete = (index) => {
    const updated = allResults.filter((_, i) => i !== index);
    setAllResults(updated);
    localStorage.setItem("hearingResults", JSON.stringify(updated));
  };

  // Delete all tests
  const handleDeleteAll = () => {
    setAllResults([]);
    localStorage.removeItem("hearingResults");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-500 text-center flex-1">
            Your Test Results
          </h1>
          {allResults.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Delete All
            </button>
          )}
        </div>

        {allResults.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <p className="text-gray-600 text-lg">
              No results yet. Please take a hearing test first.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {allResults.map((res, idx) => (
              <div
                key={idx}
                className="relative bg-white shadow-lg rounded-xl p-6 transition hover:shadow-xl group"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Test {idx + 1}
                </h2>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <b>Date:</b> {res.date}
                  </p>
                  <p>
                    <b>Left Ear Avg:</b>{" "}
                    <span className="text-blue-600">{res.leftAvg} dB HL</span>
                  </p>
                  <p>
                    <b>Right Ear Avg:</b>{" "}
                    <span className="text-red-600">{res.rightAvg} dB HL</span>
                  </p>
                  <p>
                    <b>Left Ear Condition:</b>{" "}
                    <span className="font-medium">{res.leftCondition}</span>
                  </p>
                  <p>
                    <b>Right Ear Condition:</b>{" "}
                    <span className="font-medium">{res.rightCondition}</span>
                  </p>
                </div>

                {/* Delete button - visible only on hover */}
                <button
                  onClick={() => handleDelete(idx)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-red-500 text-white p-2 rounded-full shadow"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

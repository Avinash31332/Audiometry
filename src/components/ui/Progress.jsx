import React from "react";

export function Progress({ value = 0, className = "" }) {
  return (
    <div
      className={`w-full bg-gray-200 rounded-full h-4 overflow-hidden ${className}`}
    >
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}

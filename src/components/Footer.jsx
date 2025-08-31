import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Audiometry. All rights reserved.
      </div>
    </footer>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HearingHealth from "./pages/HearingHealth";
import HearingTest from "./pages/HearingTest";
import Results from "./pages/Results";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/health" element={<HearingHealth />} />
            <Route path="/test" element={<HearingTest />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </>
    </div>
  );
}

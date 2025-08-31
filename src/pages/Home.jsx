import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-surface to-white text-slate-900">
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-primary-700">
              Check your hearing — fast & private
            </h1>
            <p className="mt-4 text-lg text-muted-max">
              A quick self-audiometry check you can run with wired headphones.
              Results are stored locally on your device — no account required.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/test">
                <Button size="lg">Start Hearing Test</Button>
              </Link>
              <Link to="/results" className="inline-block">
                <Button variant="ghost" size="lg">
                  View Results
                </Button>
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-primary-600">🔒</span>
                <div>
                  <div className="font-semibold">Private</div>
                  <div className="text-muted">
                    Results kept locally on your device
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-secondary-600">⚡</span>
                <div>
                  <div className="font-semibold">Fast</div>
                  <div className="text-muted">
                    Complete test in under 5 minutes
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-accent-600">📊</span>
                <div>
                  <div className="font-semibold">Clear results</div>
                  <div className="text-muted">Audiogram + recommendations</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Hero illustration card */}
          <div>
            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                {/* simple svg illustration */}
                <svg
                  width="220"
                  height="160"
                  viewBox="0 0 220 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0"
                    y="0"
                    width="220"
                    height="160"
                    rx="12"
                    fill="#ffffff"
                  />
                  <g transform="translate(20,30)">
                    <circle cx="30" cy="30" r="26" fill="#eff6ff" />
                    <path
                      d="M28 20 C40 25, 40 35, 28 40"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <rect
                      x="72"
                      y="10"
                      width="92"
                      height="60"
                      rx="6"
                      fill="#f0fdf4"
                      stroke="#10b981"
                    />
                    <text
                      x="118"
                      y="45"
                      fill="#065f46"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      Audiogram
                    </text>
                  </g>
                </svg>

                <div className="text-center">
                  <h3 className="text-lg font-semibold">Reliable & simple</h3>
                  <p className="text-sm text-muted">
                    Designed to approximate clinical audiometry using your
                    browser's audio engine.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FEATURES */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Why use this test?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h4 className="font-semibold mb-2">No account needed</h4>
              <p className="text-sm text-muted">
                All results stay on your device unless you export them.
              </p>
            </Card>

            <Card>
              <h4 className="font-semibold mb-2">Accessible design</h4>
              <p className="text-sm text-muted">
                Large controls, clear labels, and mobile-friendly layout.
              </p>
            </Card>

            <Card>
              <h4 className="font-semibold mb-2">Shareable reports</h4>
              <p className="text-sm text-muted">
                Export test results to CSV for your audiologist.
              </p>
            </Card>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 text-center text-sm text-muted">
          <p>
            ⚠️ This tool is not a replacement for clinical testing. If you have
            concerns, please consult an audiologist.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} Audiometry — Built for education &
            screening
          </p>
        </footer>
      </section>
    </main>
  );
}

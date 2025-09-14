import React from "react";
import { Link } from "react-router-dom";
import { FiHeadphones, FiPlay, FiThumbsUp, FiBarChart2 } from "react-icons/fi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const steps = [
    {
      icon: <FiHeadphones className="text-3xl text-green-500" />,
      title: "Plug in headphones",
      desc: "Use wired headphones for accurate results.",
    },
    {
      icon: <FiPlay className="text-3xl text-green-500" />,
      title: "Play tone",
      desc: "Listen carefully to the tones at each frequency.",
    },
    {
      icon: <FiThumbsUp className="text-3xl text-green-500" />,
      title: "Record response",
      desc: "Indicate whether you hear the tone or not.",
    },
    {
      icon: <FiBarChart2 className="text-3xl text-green-500" />,
      title: "View results",
      desc: "Check your audiogram and recommendations.",
    },
  ];

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

          {/* Step-by-Step Guide with Icons */}
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <Card
                key={idx}
                className="p-6 hover:shadow-lg transition-shadow flex items-start gap-4"
              >
                {step.icon}
                <div>
                  <h3 className="text-lg font-semibold text-primary-700">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted mt-1">{step.desc}</p>
                </div>
              </Card>
            ))}
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

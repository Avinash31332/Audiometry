import React from "react";
import { Link } from "react-router-dom";
import {
  Ear,
  Heart,
  Volume2,
  Headphones,
  AlertCircle,
  Zap,
  Thermometer,
  Bell,
} from "lucide-react";

export default function HearingHealth() {
  const hearingIssues = [
    {
      title: "Tinnitus",
      icon: AlertCircle,
      desc: "Ringing or buzzing in the ears; can be temporary or chronic.",
    },
    {
      title: "Noise-Induced Hearing Loss",
      icon: Zap,
      desc: "Damage from exposure to loud sounds over time; preventable with protection.",
    },
    {
      title: "Ear Infections",
      icon: Thermometer,
      desc: "Pain, fluid, or discomfort; can lead to temporary hearing loss if untreated.",
    },
    {
      title: "Age-Related Hearing Loss",
      icon: Bell,
      desc: "Gradual loss of hearing as part of the aging process; early detection helps.",
    },
    {
      title: "Wax Build-Up",
      icon: Ear,
      desc: "Excess earwax can block the ear canal, affecting hearing temporarily.",
    },
    {
      title: "Sudden Hearing Loss",
      icon: AlertCircle,
      desc: "Rapid hearing decrease; requires immediate medical attention.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">
          Caring for Your Hearing
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          Your hearing plays a vital role in communication, safety, and overall
          quality of life. Learn how to protect it and track your hearing health
          regularly.
        </p>
      </section>

      {/* Why it matters */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <Heart className="h-8 w-8 text-primary-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Well-being</h3>
          <p className="text-sm text-muted">
            Good hearing supports mental health, reduces stress, and keeps you
            socially connected.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <Ear className="h-8 w-8 text-primary-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Early Detection</h3>
          <p className="text-sm text-muted">
            Identifying hearing issues early can prevent further damage and
            improve treatment outcomes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <Volume2 className="h-8 w-8 text-primary-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Safety</h3>
          <p className="text-sm text-muted">
            Healthy hearing keeps you aware of your surroundings, preventing
            accidents and hazards.
          </p>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-primary-700 mb-6 text-center">
          Tips for Better Hearing
        </h2>
        <ul className="grid md:grid-cols-2 gap-6">
          <li className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
            <Headphones className="h-6 w-6 text-primary-600 mt-1" />
            <span className="text-sm text-muted">
              Keep volume levels safe when using headphones or earphones.
            </span>
          </li>
          <li className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
            <Ear className="h-6 w-6 text-primary-600 mt-1" />
            <span className="text-sm text-muted">
              Wear ear protection in noisy environments such as concerts or
              construction sites.
            </span>
          </li>
          <li className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
            <Heart className="h-6 w-6 text-primary-600 mt-1" />
            <span className="text-sm text-muted">
              Maintain overall health — exercise and diet also impact hearing.
            </span>
          </li>
          <li className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
            <Volume2 className="h-6 w-6 text-primary-600 mt-1" />
            <span className="text-sm text-muted">
              Get regular checkups and take online self-tests for early
              detection.
            </span>
          </li>
        </ul>
      </section>

      {/* Common Hearing Issues */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-primary-700 mb-6 text-center">
          Common Hearing Issues
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {hearingIssues.map((issue, idx) => {
            const Icon = issue.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
              >
                <Icon className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                <p className="text-sm text-muted">{issue.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Link
          to="/test"
          className="bg-primary-600 text-white px-6 py-3 rounded-xl shadow hover:bg-primary-700 transition"
        >
          Take a Hearing Test
        </Link>
      </section>
    </main>
  );
}

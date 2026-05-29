"use client";

import { useMemo, useState } from "react";
import { assessmentQuestions, scoreAssessment } from "@psychehire/core";
import Link from "next/link";

export default function CandidateAssessmentPage({ params }: { params: { jobId: string; candidateId: string } }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => {
    const responses = Object.entries(answers).map(([questionId, value]) => ({ questionId, value, elapsedMs: 12000, confidence: 80 }));
    return scoreAssessment(responses, { hesitationRate: 0.08, contradictionRate: 0.06, skippedRate: 0, confidenceMean: 80 });
  }, [answers]);

  return (
    <main className="min-h-screen bg-[#f6f8f5] p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="surface rounded-lg p-5">
          <p className="text-sm font-bold uppercase tracking-widest text-forest/60">Secure assessment link</p>
          <h1 className="mt-2 text-3xl font-black text-forest">Candidate Assessment</h1>
          <p className="mt-2 text-slate-600">Job: {params.jobId} · Candidate: {params.candidateId}</p>
        </header>

        {!submitted && step === 0 && (
          <section className="surface mt-5 rounded-lg p-5">
            <h2 className="text-xl font-black">Personal Information</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {["Full name", "Gender", "Age", "Location", "Phone", "Email", "Qualification", "School", "Work history", "Certifications", "LinkedIn", "Portfolio", "Preferred role", "Expected salary"].map((field) => (
                <label key={field} className="text-sm font-bold text-slate-600">
                  {field}
                  <input className="input mt-1" value={profile[field] || ""} onChange={(e) => setProfile({ ...profile, [field]: e.target.value })} />
                </label>
              ))}
              <label className="text-sm font-bold text-slate-600 md:col-span-2">
                Resume upload
                <input className="input mt-1" type="file" accept=".pdf,.doc,.docx" />
              </label>
            </div>
            <button className="btn btn-primary mt-5" onClick={() => setStep(1)}>Continue to assessment</button>
          </section>
        )}

        {!submitted && step === 1 && (
          <section className="surface mt-5 rounded-lg p-5">
            <h2 className="text-xl font-black">Psychometric Modules</h2>
            <div className="mt-4 grid gap-4">
              {assessmentQuestions.map((q) => (
                <div key={q.id} className="rounded-lg border border-forest/10 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-sage">{q.domain} · {q.trait}</p>
                      <p className="mt-1 font-semibold">{q.prompt}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button key={value} className={`h-10 w-10 rounded-lg border ${answers[q.id] === value ? "bg-forest text-white" : "bg-white"}`} onClick={() => setAnswers({ ...answers, [q.id]: value })}>{value}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary mt-5" onClick={() => setSubmitted(true)}>Submit assessment</button>
          </section>
        )}

        {submitted && (
          <section className="surface mt-5 rounded-lg p-6">
            <h2 className="text-2xl font-black text-forest">Submitted</h2>
            <p className="mt-2 text-slate-600">Your assessment has been securely submitted for HR review.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-white p-4"><span className="text-sm text-slate-500">Profile score</span><strong className="block text-3xl text-forest">{result.psychProfileScore}</strong></div>
              <div className="rounded-lg bg-white p-4"><span className="text-sm text-slate-500">Leadership readiness</span><strong className="block text-3xl text-forest">{result.leadershipReadiness}</strong></div>
              <div className="rounded-lg bg-white p-4"><span className="text-sm text-slate-500">Human review</span><strong className="block text-lg text-forest">Required</strong></div>
            </div>
            <Link href="/interview/session/demo-token" className="btn btn-secondary mt-5">Continue to video interview</Link>
          </section>
        )}
      </div>
    </main>
  );
}

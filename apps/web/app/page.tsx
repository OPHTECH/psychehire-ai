import Link from "next/link";
import { ArrowRight, BrainCircuit, Building2, LockKeyhole, Sparkles } from "lucide-react";

const sections = [
  ["Psychometric science", "OCEAN, MBTI-style dimensions, DISC, cognitive reasoning, emotional intelligence, integrity, stress, and leadership scoring."],
  ["HR benefits", "Shortlist candidates, benchmark teams, guide training, plan succession, and document human-reviewed advisory decisions."],
  ["Security assurance", "Tenant isolation, consent capture, expiring invitations, RBAC, audit logs, signed media URLs, and GDPR-ready data controls."],
  ["Industries served", "Technology, finance, logistics, healthcare, manufacturing, professional services, retail, and public-sector HR teams."]
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f6f8f5_0%,#ffffff_42%,#d7ded9_100%)]">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-forest/70">Enterprise psychological profiling</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight tracking-normal text-forest md:text-7xl">PsycheHire AI</h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-700">
              A secure HR psychometric assessment, behavioral interview, and workforce intelligence platform for real recruitment, employee development, retention, and succession workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn btn-primary">Open dashboard <ArrowRight size={18} /></Link>
              <Link href="/assessment/job-ops/candidate-tari" className="btn btn-secondary">Candidate assessment</Link>
            </div>
          </div>
          <div className="surface rounded-lg p-5">
            <div className="grid grid-cols-2 gap-3">
              {[BrainCircuit, Building2, LockKeyhole, Sparkles].map((Icon, index) => (
                <div key={index} className="rounded-lg bg-white p-5">
                  <Icon className="text-forest" />
                  <div className="mt-8 h-2 rounded bg-sage/30" />
                  <div className="mt-2 h-2 w-2/3 rounded bg-olive/70" />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-forest p-5 text-white">
              <div className="text-sm text-white/70">Composite talent score</div>
              <div className="mt-2 text-5xl font-black">86</div>
              <div className="mt-3 text-sm text-white/72">Psychometric + interview + workforce signals, always advisory.</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {sections.map(([title, body]) => (
          <article key={title} className="surface rounded-lg p-6">
            <h2 className="text-xl font-black text-forest">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
          </article>
        ))}
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3">
          {["Create secure campaign", "Assess and interview", "Review advisory report"].map((step, index) => (
            <div key={step} className="border-l-4 border-sage pl-5">
              <div className="text-sm font-black text-forest/60">0{index + 1}</div>
              <h3 className="mt-2 text-2xl font-black">{step}</h3>
              <p className="mt-3 text-slate-600">HR controls templates, privacy settings, scoring weights, reports, exports, and approval workflows.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { BarChart3, BriefcaseBusiness, FileText, Gauge, Home, Settings, ShieldCheck, UserRoundSearch, Video } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  ["/dashboard", "Overview", Home],
  ["/candidates", "Candidates", UserRoundSearch],
  ["/analytics", "Analytics", BarChart3],
  ["/interview/session/demo-token", "Video Review", Video],
  ["/reports/demo", "Reports", FileText],
  ["/employee-reassessment", "Reassessment", Gauge],
  ["/roles", "Roles", BriefcaseBusiness],
  ["/organization", "Organization", ShieldCheck],
  ["/settings", "Settings", Settings]
] as const;

export function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dashboard-grid">
      <aside className="bg-forest text-white p-5">
        <Link href="/" className="block">
          <div className="text-2xl font-black">PsycheHire AI</div>
          <div className="text-sm text-white/70">Talent intelligence suite</div>
        </Link>
        <nav className="mt-8 grid gap-1">
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/82 hover:bg-white/10">
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 rounded-lg border border-white/14 bg-white/8 p-4 text-sm text-white/75">
          AI recommendations are advisory. Final hiring, promotion, disciplinary, or termination actions require documented human review.
        </div>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-forest/10 bg-white/85 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-forest/60">Enterprise console</p>
            <h1 className="text-2xl font-black">{title}</h1>
          </div>
          <Link className="btn btn-primary" href="/assessment/job-ops/candidate-tari">Create assessment</Link>
        </header>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6">
          {children}
        </motion.div>
      </main>
    </div>
  );
}


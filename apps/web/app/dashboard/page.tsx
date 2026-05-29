import { Shell } from "../../components/Shell";
import { kpis, candidates, talent } from "../../components/data";
import { TalentBars } from "../../components/Charts";

export default function DashboardPage() {
  return (
    <Shell title="HR Dashboard">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {kpis.map(([label, value, note]) => (
          <article key={label} className="surface rounded-lg p-4">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <strong className="mt-2 block text-3xl text-forest">{value}</strong>
            <span className="text-xs text-slate-500">{note}</span>
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <article className="surface rounded-lg p-5">
          <h2 className="text-xl font-black">Candidate Database</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b"><th className="py-3">Name</th><th>Role</th><th>Fit</th><th>Risk</th><th>Status</th></tr></thead>
              <tbody>{candidates.map((c) => <tr key={c.name} className="border-b border-slate-100"><td className="py-3 font-bold">{c.name}</td><td>{c.role}</td><td>{c.fit}%</td><td>{c.risk}</td><td>{c.status}</td></tr>)}</tbody>
            </table>
          </div>
        </article>
        <article className="surface rounded-lg p-5">
          <h2 className="text-xl font-black">Talent Distribution</h2>
          <TalentBars data={talent} />
        </article>
      </section>
    </Shell>
  );
}


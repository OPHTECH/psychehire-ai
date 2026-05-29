import Link from "next/link";
import { Shell } from "../../components/Shell";
import { candidates } from "../../components/data";

export default function CandidatesPage() {
  return (
    <Shell title="Candidate Database">
      <div className="surface rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input className="input max-w-md" placeholder="Search candidates, roles, departments" />
          <div className="flex gap-2"><button className="btn btn-secondary">Export CSV</button><Link className="btn btn-primary" href="/compare">Compare</Link></div>
        </div>
        <table className="mt-5 w-full text-left text-sm">
          <thead><tr className="border-b"><th className="py-3">Candidate</th><th>Role</th><th>Fit</th><th>Risk</th><th>Notes</th><th>Status</th></tr></thead>
          <tbody>{candidates.map((c) => <tr key={c.name} className="border-b border-slate-100"><td className="py-3 font-black">{c.name}</td><td>{c.role}</td><td>{c.fit}%</td><td>{c.risk}</td><td><input className="input" placeholder="HR note" /></td><td>{c.status}</td></tr>)}</tbody>
        </table>
      </div>
    </Shell>
  );
}


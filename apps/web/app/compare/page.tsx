import { Shell } from "../../components/Shell";
import { candidates } from "../../components/data";

export default function ComparePage() {
  return (
    <Shell title="Candidate Comparison">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {candidates.map((c) => (
          <article className="surface rounded-lg p-5" key={c.name}>
            <h2 className="text-xl font-black text-forest">{c.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.role}</p>
            <div className="mt-5 text-5xl font-black">{c.fit}</div>
            <p className="mt-2 text-sm font-bold">Risk: {c.risk}</p>
            <button className="btn btn-secondary mt-5 w-full">Add interview note</button>
          </article>
        ))}
      </section>
    </Shell>
  );
}

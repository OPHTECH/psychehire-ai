import { Shell } from "../../../components/Shell";
import { TraitRadar } from "../../../components/Charts";
import { report } from "../../../components/data";

export default function ReportPage() {
  return (
    <Shell title="Psych Report Viewer">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <article className="surface rounded-lg p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-forest/60">Candidate summary</p>
          <h2 className="mt-2 text-3xl font-black">{report.candidate}</h2>
          <p className="mt-1 text-slate-500">{report.role}</p>
          <p className="mt-5 leading-7 text-slate-700">{report.summary}</p>
          <div className="mt-6 grid gap-3">
            {report.recommendations.map((item) => <div key={item} className="rounded-lg bg-sage/12 p-3 text-sm font-semibold text-forest">{item}</div>)}
          </div>
        </article>
        <article className="surface rounded-lg p-6">
          <h2 className="text-xl font-black">Trait Map</h2>
          <TraitRadar traits={report.traits} />
        </article>
      </div>
    </Shell>
  );
}


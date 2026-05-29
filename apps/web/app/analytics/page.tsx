import { Shell } from "../../components/Shell";
import { TalentBars } from "../../components/Charts";
import { talent } from "../../components/data";

export default function AnalyticsPage() {
  return (
    <Shell title="Workforce Intelligence">
      <section className="grid gap-4 md:grid-cols-3">
        {["Talent Heatmap", "Leadership Pipeline", "Attrition Forecast"].map((name) => (
          <article key={name} className="surface rounded-lg p-5">
            <h2 className="text-xl font-black text-forest">{name}</h2>
            <p className="mt-3 text-sm text-slate-600">Combines reassessment, performance, survey, and approved workplace signal metadata.</p>
          </article>
        ))}
      </section>
      <article className="surface mt-6 rounded-lg p-6">
        <h2 className="text-xl font-black">Department Risk and Potential</h2>
        <TalentBars data={talent} />
      </article>
    </Shell>
  );
}


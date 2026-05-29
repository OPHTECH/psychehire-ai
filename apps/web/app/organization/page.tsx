import { Shell } from "../../components/Shell";

export default function OrganizationPage() {
  return (
    <Shell title="Organization Setup">
      <section className="grid gap-5 lg:grid-cols-2">
        {["Departments", "Privacy policy", "Consent scopes", "Feature toggles"].map((title) => (
          <article key={title} className="surface rounded-lg p-5">
            <h2 className="text-xl font-black text-forest">{title}</h2>
            <textarea className="input mt-4 min-h-32" defaultValue={title === "Privacy policy" ? "Metadata only for communication analytics. Content analysis requires explicit employee opt-in." : ""} />
            <button className="btn btn-primary mt-4">Save</button>
          </article>
        ))}
      </section>
    </Shell>
  );
}

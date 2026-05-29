import { Shell } from "../../components/Shell";

export default function RolesPage() {
  const roles = ["Software Engineer", "Sales", "Operations", "HR", "Finance", "Management", "Product", "Customer Service", "Logistics", "Leadership"];
  return (
    <Shell title="Role Management">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <article key={role} className="surface rounded-lg p-5">
            <h2 className="text-xl font-black text-forest">{role}</h2>
            <p className="mt-3 text-sm text-slate-600">Configure competencies, psychometric weightings, interview prompts, and report templates.</p>
            <button className="btn btn-secondary mt-5">Edit weights</button>
          </article>
        ))}
      </section>
    </Shell>
  );
}

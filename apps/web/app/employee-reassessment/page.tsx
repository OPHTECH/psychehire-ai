import { Shell } from "../../components/Shell";

export default function EmployeeReassessmentPage() {
  return (
    <Shell title="Employee Reassessment">
      <section className="surface rounded-lg p-6">
        <h2 className="text-xl font-black">Internal Assessment Engine</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Quarterly review", "Promotion consideration", "Team restructuring", "Performance concern", "Incident review", "Leadership pipeline"].map((trigger) => (
            <label key={trigger} className="rounded-lg bg-white p-4 font-bold"><input type="checkbox" className="mr-3" />{trigger}</label>
          ))}
        </div>
        <button className="btn btn-primary mt-5">Assign reassessment</button>
      </section>
    </Shell>
  );
}

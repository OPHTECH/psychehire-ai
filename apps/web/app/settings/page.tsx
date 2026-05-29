import { Shell } from "../../components/Shell";

export default function SettingsPage() {
  return (
    <Shell title="Settings">
      <section className="surface rounded-lg p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {["Email settings", "Report templates", "Branding", "Data retention", "Signed URL expiry", "Audit export"].map((label) => (
            <label className="text-sm font-bold" key={label}>{label}<input className="input mt-1" placeholder={label} /></label>
          ))}
        </div>
        <button className="btn btn-primary mt-5">Save settings</button>
      </section>
    </Shell>
  );
}

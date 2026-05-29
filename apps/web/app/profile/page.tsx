import { Shell } from "../../components/Shell";

export default function ProfilePage() {
  return (
    <Shell title="Profile">
      <section className="surface max-w-3xl rounded-lg p-6">
        <h2 className="text-xl font-black">HR Administrator</h2>
        <div className="mt-4 grid gap-3">
          <input className="input" defaultValue="Amara Okeke" />
          <input className="input" defaultValue="hr@verdant.example" />
          <input className="input" defaultValue="HR_ADMIN" />
        </div>
        <button className="btn btn-primary mt-5">Update profile</button>
      </section>
    </Shell>
  );
}

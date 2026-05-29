import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8f5] p-4">
      <form className="surface w-full max-w-lg rounded-lg p-6">
        <h1 className="text-3xl font-black text-forest">Create organization</h1>
        {["Organization", "Admin name", "Email", "Password"].map((field) => <input key={field} className="input mt-3" placeholder={field} type={field === "Password" ? "password" : "text"} />)}
        <Link href="/organization" className="btn btn-primary mt-5 w-full">Register</Link>
      </form>
    </main>
  );
}


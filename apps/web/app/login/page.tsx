import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f8f5] p-4">
      <form className="surface w-full max-w-md rounded-lg p-6">
        <h1 className="text-3xl font-black text-forest">Login</h1>
        <input className="input mt-5" placeholder="Email" />
        <input className="input mt-3" placeholder="Password" type="password" />
        <Link href="/dashboard" className="btn btn-primary mt-5 w-full">Sign in</Link>
      </form>
    </main>
  );
}


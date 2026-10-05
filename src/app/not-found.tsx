import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="text-center">
        <p className="text-7xl font-black text-cyan-300">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page moved off the roadmap.</h1>
        <Link className="mt-6 inline-block text-cyan-300 underline" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}

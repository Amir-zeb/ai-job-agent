import Link from "next/link";

export default function Home() {
  return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Link href='jobs' className="text-white text-2xl">Goto Jobs Screen</Link>
      </main>
  );
}

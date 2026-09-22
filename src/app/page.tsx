import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { btnDark } from '@/components/Button';

export const metadata: Metadata = {
  title: "ComMunity — SF's Transit Magazine",
  description:
    "ComMunity is a free, independent magazine about life on San Francisco's Muni. Read online free.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">

        {/* Background photo */}
        <Image
          src="/background.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 w-72 sm:w-96">

          <img src="/title-white.svg" alt="ComMunity" className="w-full" />

          <p className="text-[#D94550] font-semibold text-xs uppercase tracking-widest -mt-2">
            SF&apos;s Independent Transit Magazine
          </p>

          <h1 className="text-xl sm:text-2xl font-bold leading-snug text-white">
            Stories from the bus stop,
            <br />the platform, and the ride.
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Issue 3 is out now — free to read online.
          </p>

          <Link
            href="/read"
            className="w-full flex items-center justify-center gap-2 rounded-none bg-white text-gray-900 font-semibold text-sm py-3 px-4 hover:bg-gray-100 transition"
          >
            Read Free <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs animate-bounce">
          ↓
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────── */}
      <section className="bg-white text-gray-900 py-20 px-4">
        <div className="max-w-xl mx-auto space-y-5">
          <img src="/title-red.svg" alt="ComMunity" className="w-52 mb-2" />
          <p className="text-lg text-gray-700 leading-relaxed">
            A print magazine celebrating San Francisco&apos;s Muni — the buses, trains,
            cable cars, and the people who ride them every day. Transit news, neighborhood
            stories, photography, and the culture of getting around the city.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Issue 3 is free to read right now.
          </p>
          <div className="pt-2">
            <Link href="/read" className={btnDark}>
              Read Issue 3 Free <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-500 py-8 px-4 text-center text-xs">
        <img src="/seal-white.png" alt="ComMunity SF Magazine seal" className="w-10 mx-auto mb-3 opacity-50" />
        <p>ComMunity Magazine · San Francisco, CA</p>
        <p className="mt-1">
          <Link href="/read" className="underline hover:text-white transition">Read online</Link>
        </p>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';
import { btnDark } from '@/components/Button';

export const metadata: Metadata = {
  title: "ComMunity — SF's Transit Magazine",
  description:
    "ComMunity is a free, independent magazine about life on San Francisco's Muni. Read online free, or buy a print copy to support the mag.",
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

        {/* Content — all items pinned to the same width */}
        <div className="relative z-10 flex flex-col items-center gap-5 w-72 sm:w-96">

          {/* Wordmark SVG (outlined paths, renders everywhere) */}
          <img src="/title-white.svg" alt="ComMunity" className="w-full" />

          <p className="text-[#D94550] font-semibold text-xs uppercase tracking-widest -mt-2">
            SF&apos;s Independent Transit Magazine
          </p>

          <h1 className="text-xl sm:text-2xl font-bold leading-snug text-white">
            Stories from the bus stop,
            <br />the platform, and the ride.
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Issue 2 is out now — free to read online. Love it on paper? Buy a
            print copy and help fund Issue 3.
          </p>

          {/* Buttons */}
          <div className="flex flex-row gap-2.5 w-full">
            <Link
              href="/read"
              className="flex-1 flex items-center justify-center gap-2 rounded-none bg-white text-gray-900 font-semibold text-sm py-3 px-4 hover:bg-gray-100 transition"
            >
              Read Free <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <Link
              href="/subscribe"
              className="flex-1 flex items-center justify-center gap-2 rounded-none bg-white text-gray-900 font-semibold text-sm py-3 px-4 hover:bg-gray-100 transition"
            >
              Buy a Print <Newspaper size={14} strokeWidth={2} />
            </Link>
          </div>

          <p className="text-gray-500 text-xs">
            Apple Pay &amp; Google Pay accepted.
          </p>
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
            Issue 2 is free to read right now. Want it on paper? Buy a print
            copy — your purchase goes directly toward printing Issue 3.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/read" className={btnDark}>
              Read Issue 2 Free <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-gray-900 text-gray-900 font-semibold text-sm px-5 py-3 hover:bg-gray-100 transition"
            >
              Buy a Print Copy <Newspaper size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Buy CTA ───────────────────────────────────────────────── */}
      <section className="bg-[#D94550] text-white py-20 px-4">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Support local transit journalism</h2>
          <p className="text-lg opacity-90">
            Buy a print copy of Issue 2 — mailed to your door, and every dollar
            helps fund Issue 3.
          </p>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-white text-[#D94550] font-semibold text-sm px-10 py-3 hover:bg-gray-100 transition mt-2"
          >
            Buy a Print Copy <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-500 py-8 px-4 text-center text-xs">
        <img src="/seal-white.png" alt="ComMunity SF Magazine seal" className="w-10 mx-auto mb-3 opacity-50" />
        <p>ComMunity Magazine · San Francisco, CA</p>
        <p className="mt-1">
          <Link href="/read" className="underline hover:text-white transition">Read online</Link>
          {' · '}
          <Link href="/subscribe" className="underline hover:text-white transition">Buy a print copy</Link>
        </p>
      </footer>
    </div>
  );
}

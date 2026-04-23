import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Barlow_Condensed } from 'next/font/google';
import SubscribeForm from '@/components/SubscribeForm';

const barlowCondensed = Barlow_Condensed({
  weight: ['700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Subscribe — ComMunity Magazine',
  description: "Subscribe to ComMunity and get SF's transit magazine delivered to your door.",
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header — matches /read */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <Link href="/">
          <img src="/seal-white-sm.png" alt="ComMunity" className="h-7 opacity-90" />
        </Link>
        <Link
          href="/read"
          className="text-xs font-semibold text-gray-400 hover:text-white transition flex items-center gap-1.5"
        >
          Read free online <BookOpen size={12} strokeWidth={2.5} />
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className={`${barlowCondensed.className} text-5xl font-bold text-white mb-3 leading-tight`}>
            Get <em>COMMUNITY</em> in your mailbox
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Subscribe for $5/month (or more!) and we&apos;ll mail you each print issue.
            Your support funds the next issue — thank you.
          </p>
        </div>

        <SubscribeForm />
      </main>
    </div>
  );
}

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import SubscribeForm from '@/components/SubscribeForm';

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
          className="text-xs font-semibold text-gray-400 hover:text-white transition flex items-center gap-1"
        >
          Read free online <ArrowUpRight size={12} strokeWidth={2.5} />
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">
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

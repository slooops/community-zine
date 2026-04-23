import Link from 'next/link';
import SubscribeForm from '@/components/SubscribeForm';

export const metadata = {
  title: 'Subscribe — ComMunity Magazine',
  description: 'Subscribe to ComMunity and get SF\'s transit magazine delivered to your door.',
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">ComMunity</Link>
          <Link href="/read" className="text-sm text-gray-300 hover:text-white transition">
            Read free online ↗
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get ComMunity in your mailbox
          </h1>
          <p className="text-gray-600 text-lg">
            Subscribe for $5/month (or more!) and we&apos;ll mail you each print issue.
            Your support funds the next issue — thank you.
          </p>
        </div>

        <SubscribeForm />
      </main>
    </div>
  );
}

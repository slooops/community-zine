import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { btnPrimary } from '@/components/Button';

const MagazineViewer = dynamic(() => import('@/components/MagazineViewer'), { ssr: false });

export const metadata = {
  title: 'Read — ComMunity Magazine',
  description: 'Read ComMunity, the SF transit magazine, free online.',
};

export default function ReadPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <Link href="/">
          <img src="/seal-white-sm.png" alt="ComMunity" className="h-7 opacity-90" />
        </Link>
        <Link href="/subscribe" className={`${btnPrimary} px-3 py-1.5 text-xs`}>
          Get Print Copy <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </header>

      {/* Viewer */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <MagazineViewer />
      </main>

      {/* Subscribe banner */}
      <div className="bg-[#D94550] text-white text-center py-3 px-4">
        <p className="text-sm font-semibold">
          Love the magazine?{' '}
          <Link href="/subscribe" className="underline font-bold">
            Subscribe for $5/month
          </Link>{' '}
          and get print copies mailed to your door.
        </p>
      </div>
    </div>
  );
}

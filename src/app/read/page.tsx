import dynamic from 'next/dynamic';
import Link from 'next/link';

const MagazineViewer = dynamic(() => import('@/components/MagazineViewer'), { ssr: false });

export const metadata = {
  title: 'Read — ComMunity Magazine',
  description: 'Read ComMunity, the SF transit magazine, free online.',
};

export default function ReadPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <Link href="/">
          <img src="/seal-white-sm.png" alt="ComMunity" className="h-7 opacity-90" />
        </Link>
      </header>

      {/* Viewer */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <MagazineViewer />
      </main>
    </div>
  );
}

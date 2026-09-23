import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getIssue } from '@/lib/issues';

const MagazineViewer = dynamic(() => import('@/components/MagazineViewer'), { ssr: false });

type SearchParams = { issue?: string };

export function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const issue = getIssue(searchParams.issue);
  return {
    title: `Read ${issue.label} — ComMunity Magazine`,
    description: `Read ComMunity ${issue.label}, the SF transit magazine, free online.`,
  };
}

export default function ReadPage({ searchParams }: { searchParams: SearchParams }) {
  const issue = getIssue(searchParams.issue);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <Link href="/">
          <img src="/seal-white-sm.png" alt="ComMunity" className="h-7 opacity-90" />
        </Link>
        <span className="ml-3 text-sm text-gray-400 font-medium">{issue.label}</span>
      </header>

      {/* Viewer */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <MagazineViewer issueSlug={issue.slug} />
      </main>
    </div>
  );
}

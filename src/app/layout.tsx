import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "ComMunity — SF's Transit Magazine",
  description:
    "ComMunity is a free, independent magazine about life on San Francisco's Muni.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import { getHostedUrl } from '@/utils/urlHelper';
import { title, description } from '@/constant';
import { Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const NotoSerifJP = Noto_Serif_JP({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-serif' });

// Please include the name of the site, etc.
const url = new URL(getHostedUrl());

export const metadata: Metadata = {
  metadataBase: url,
  title: { default: title, template: `%s ｜ ${title}` },
  description,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url,
    title,
    description,
    siteName: title,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    site: '@minagishl',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={NotoSerifJP.className}>{children}</body>
    </html>
  );
}

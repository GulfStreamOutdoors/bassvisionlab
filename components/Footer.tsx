'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-deep-black text-white px-6 py-4 flex items-center justify-between text-sm">
      <span>
        Powered by <span className="text-bayou-lime font-semibold">WM Bayou</span>
      </span>
      <nav className="flex gap-4">
        <Link href="/science" className="text-bayou-lime hover:underline">
          Science
        </Link>
        <a
          href="https://wmbayou.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-bayou-lime hover:underline"
        >
          Shop
        </a>
      </nav>
    </footer>
  );
}

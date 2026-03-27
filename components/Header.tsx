'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-deep-black text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-bayou-lime font-bold text-xl tracking-wide">WM Bayou</span>
        <span className="text-white text-lg font-semibold">|</span>
        <span className="text-bayou-lime text-lg font-semibold">Bass Vision Lab</span>
      </div>
      <nav>
        <Link href="/science" className="text-bayou-lime hover:underline text-sm font-medium">
          Science
        </Link>
      </nav>
    </header>
  );
}

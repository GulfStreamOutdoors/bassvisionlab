'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-deep-black text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/wmbayou-logo.png"
          alt="WM Bayou"
          width={140}
          height={61}
          className="h-9 w-auto"
          priority
        />
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

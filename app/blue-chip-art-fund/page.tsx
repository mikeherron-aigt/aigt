'use client';

import Link from "next/link";
import Header from "../components/Header";

export default function BlueChipArtFundPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Header />
      <main style={{ padding: '80px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 40, lineHeight: '44px' }}>
          Blue Chip Art Fund
        </h1>
        <p style={{ marginTop: 16, color: '#555', fontSize: 18, lineHeight: '28px' }}>
          This page is being restored.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href="/request-access">Request Access</Link>
        </p>
      </main>
    </div>
  );
}

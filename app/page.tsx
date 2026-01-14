"use client";

import BuilderClientPage from "./BuilderClientPage";

export default function Home() {
  return (
    <BuilderClientPage>
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-semibold">AIGT</h1>
        <p className="mt-2 text-sm opacity-70">
          Builder preview is connected. Next step is wiring Builder content.
        </p>
      </main>
    </BuilderClientPage>
  );
}

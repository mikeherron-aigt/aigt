'use client';

import Image from "next/image";
import Link from "next/link";

export default function MuseumPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        {/* HERO */}
        <section className="w-full relative bg-[#f5f5f5]">
          <div className="max-w-[1440px] mx-auto relative">
            <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[691px] overflow-hidden">
              <Image
                src="/museum_hero.png"
                alt="Museum exterior with landscaping and signage"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />

              <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-8 lg:px-[80px]">
                <div
                  className="bg-white/90 border border-black/10 max-w-[560px]"
                  style={{ backdropFilter: "blur(6px)" }}
                >
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h1
                      style={{
                        fontFamily:
                          "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
                        fontSize: "56px",

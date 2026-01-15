'use client';

import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
              />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-8 ml-auto">
              <a href="#about" className="nav-link">About</a>
              <a href="#offerings" className="nav-link">Offerings</a>
              <a href="#gallery" className="nav-link">Gallery</a>
              <a href="#stewardship" className="nav-link">Stewardship</a>
              <span className="nav-separator">|</span>
              <button className="btn-primary">Request Access</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[80px] py-12 sm:py-16 lg:py-24 flex items-center">
              <div className="max-w-[637px]">
                {/* Heading */}
                <h1 className="hero-title" style={{marginBottom: '17px'}}>
                  <div style={{fontSize: '41px', lineHeight: '45px'}}>
                    The Art That Matters<br />The Stewardship It Deserves
                  </div>
                </h1>

                {/* Subtitle */}
                <div className="hero-subtitle">
                  <p>
                    Art Investment Group Trust was established to acquire, hold, and steward artworks of cultural significance within a disciplined, governed framework.{" "}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-[18px] mt-6 sm:mt-8">
                  <button className="cta-primary">
                    Request Access
                  </button>
                  <button className="cta-secondary">
                    View System Overview
                  </button>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[680px] overflow-hidden bg-gallery-plaster">
              <div className="absolute inset-0">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fffdf589de0bc4ea786d46b0d19e5477d?format=webp&width=800"
                  alt="Cultural artwork representing the trust's collection"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements - Positioned at bottom of image, above footer */}
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 206px)'}}></div>
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 206px)', height: '170px'}}></div>
          <div className="absolute lg:left-[calc(60%-32px)] w-8 bg-deep-patina hidden lg:block pointer-events-none" style={{top: 'calc(100% - 36px)', height: '36px'}}></div>

          {/* Footer Bar */}
          <div className="h-[36px] relative">
            {/* Left portion - #DADADA */}
            <div className="absolute left-0 top-0 h-full bg-gallery-plaster hidden lg:block" style={{width: 'calc(60% - 32px)'}}></div>
            {/* Right portion - #A1A69D */}
            <div className="absolute top-0 h-full bg-ledger-stone hidden lg:block" style={{left: 'calc(60%)', right: '0'}}></div>
            {/* Dark green square at intersection */}
            <div className="absolute top-0 w-8 h-full bg-deep-patina hidden lg:block" style={{left: 'calc(60% - 32px)'}}></div>
          </div>
        </div>

        {/* Featured Collection Section */}
        <section className="w-full bg-white py-16 sm:py-20 lg:py-[104px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
            <h2 className="section-heading">
              Featured Collection
            </h2>
          </div>

          <div className="px-4 sm:px-8 lg:px-[80px]">
            <div className="overflow-hidden -mx-4 sm:-mx-8 lg:-mx-[80px]">
              <div
                ref={sliderRef}
                className="artwork-slider"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
              >
              {/* Artwork Card 1 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/25ee69383552e9f873f3551083817292fb7fbc14?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Artwork Card 2 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/313b3f436ad7a871d72459a182f82360d9123c0e?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Artwork Card 3 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/8d3bcb814a5fd11404bd954a1295075a5be7f529?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Artwork Card 4 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d2c57baf20a78edb5c4e08b53ad5b7b52298bd73?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Artwork Card 5 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/7fa7dcff6f05eaec42b8b896c2be111486030e46?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Duplicate - Artwork Card 1 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/25ee69383552e9f873f3551083817292fb7fbc14?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Duplicate - Artwork Card 2 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/313b3f436ad7a871d72459a182f82360d9123c0e?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Duplicate - Artwork Card 3 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/8d3bcb814a5fd11404bd954a1295075a5be7f529?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Duplicate - Artwork Card 4 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d2c57baf20a78edb5c4e08b53ad5b7b52298bd73?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>

              {/* Duplicate - Artwork Card 5 */}
              <div className="artwork-card">
                <div className="artwork-image-wrapper">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/7fa7dcff6f05eaec42b8b896c2be111486030e46?width=539"
                    alt="Artwork Painting"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">Artwork Painting Title</h3>
                  <p className="artwork-details">Artist Name, Year Painting<br />1995</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governance Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_40%] gap-0">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-[132px] flex items-center justify-start h-full">
                <div className="max-w-[579px]">
                  <h2 className="governance-title">
                    Governance is the product.
                  </h2>
                  <p className="governance-description">
                    This platform is built as a trust-led framework where custody, authority, and oversight are structurally separated. The objective is continuity: decisions remain disciplined, assets remain protected, and participation remains controlled.
                  </p>
                  <button className="governance-cta">
                    Review Governance
                  </button>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative w-full aspect-square overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/e21bd6681b65794951201d363a4ebcc461feb16c?width=1355"
                    alt="Contemporary artwork representing governance structure"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Funds Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[104px]">
          <div className="max-w-[1441px] mx-auto">
            <div className="flex flex-col items-center gap-20">
              {/* Top Content */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col items-center gap-4 max-w-full">
                <div className="flex flex-col items-center gap-4 max-w-[995px]">
                  <h2 className="funds-title">
                    Two funds. Separate mandates. One standard of care.
                  </h2>
                  <p className="funds-description">
                    The platform supports multiple funds with independent economics and governance. This separation preserves clarity, reduces cross-risk, and reinforces institutional credibility.
                  </p>
                  <button className="funds-cta">
                    Review Governance
                  </button>
                </div>
              </div>

              {/* Fund Cards */}
              <div className="px-4 sm:px-8 lg:px-[80px] flex flex-col lg:flex-row justify-center items-stretch gap-6 lg:gap-[34px] w-full">
                  {/* Ethereum Art Fund Card */}
                  <div className="fund-card">
                    <div className="fund-card-content">
                      <h3 className="fund-card-title">Ethereum Art Fund</h3>
                      <h4 className="fund-card-subtitle">A unified catalog strategy governed as a single cultural asset.</h4>
                      <p className="fund-card-description">
                        Acquires and governs a coherent body of contemporary work as a long-duration asset. Value creation is driven by provenance integrity, catalog consolidation, institutional placement, and disciplined stewardship.
                      </p>
                    </div>
                  </div>

                  {/* Blue Chip Art Fund Card */}
                  <div className="fund-card">
                    <div className="fund-card-content">
                      <h3 className="fund-card-title">Blue Chip Art Fund</h3>
                      <h4 className="fund-card-subtitle">An independently capitalized anchor focused on established museum-grade works.</h4>
                      <p className="fund-card-description">
                        Targets historically significant works with emphasis on integrity, preservation, and long-term positioning. Operates independently with separate assets and oversight.
                      </p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </section>

        {/* Decorative Bar - Above Stewardship */}
        <div className="w-full h-[36px] relative hidden lg:block">
          {/* Left portion - Gallery Plaster */}
          <div className="absolute left-0 top-0 h-full bg-gallery-plaster" style={{width: 'calc(60% - 32px)'}}></div>
          {/* Right portion - Ledger Stone */}
          <div className="absolute top-0 h-full bg-ledger-stone" style={{left: 'calc(60%)', right: '0'}}></div>
          {/* Dark green square at intersection */}
          <div className="absolute top-0 w-8 h-full bg-deep-patina" style={{left: 'calc(60% - 32px)'}}></div>
        </div>

        {/* Stewardship Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_584px] gap-0 py-12 sm:py-16 lg:py-[104px]">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[128px] flex items-center justify-start h-full">
                <div className="max-w-[581px] pt-0">
                  <h2 className="stewardship-title">
                    Stewardship is enforced through process.
                  </h2>
                  <p className="stewardship-description">
                    The platform supports multiple funds with independent economics and governance. This separation preserves clarity, reduces cross-risk, and reinforces institutional credibility.
                  </p>
                  <button className="stewardship-cta">
                    See the Stewardship Standard
                  </button>
                </div>
              </div>

              {/* Cards Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] lg:pr-[116px] flex flex-col gap-[30px]">
                {/* Custody Card */}
                <div className="stewardship-card">
                  <h3 className="stewardship-card-title">Custody</h3>
                  <p className="stewardship-card-description">
                    Assets are held within a controlled custody approach designed to reduce ambiguity and preserve integrity.
                  </p>
                </div>

                {/* Provenance Card */}
                <div className="stewardship-card">
                  <h3 className="stewardship-card-title">Provenance</h3>
                  <p className="stewardship-card-description">
                    Documentation is treated as a primary asset, tracked and maintained as part of the platform's long-term standard.
                  </p>
                </div>

                {/* Oversight Card */}
                <div className="stewardship-card">
                  <h3 className="stewardship-card-title">Oversight</h3>
                  <p className="stewardship-card-description">
                    Decision-making is governed through defined authority, review, and accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Context Section */}
        <section className="w-full bg-white py-12 sm:py-16 lg:py-[169px]">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[482px_1fr] gap-8 lg:gap-[80px]">
              {/* Image Column */}
              <div className="px-4 sm:px-8 lg:pl-[125px] lg:pr-0">
                <div className="relative w-full aspect-[482/612]">
                  <Image
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d49e6516dcaa72fcde4a33a5cdc6a6b517677ce7?width=964"
                    alt="Contemporary artwork illustrating institutional context"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 482px"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:pr-[125px] lg:pl-0 flex items-center">
                <div className="max-w-[579px]">
                  <h2 className="institutional-title">
                    Institutional context is part of the custody model.
                  </h2>
                  <p className="institutional-description">
                    A museum structure supports exhibition and placement while preserving separation from fund economics. Cultural infrastructure is treated as permanent context, not a marketing layer.
                  </p>
                  <ul className="institutional-list">
                    <li>Nonprofit museum structure</li>
                    <li>Art is loaned, not sold</li>
                    <li>Curatorial depth strengthens long-duration positioning</li>
                    <li>Mission remains distinct from investment operations</li>
                  </ul>
                  <button className="institutional-cta">
                    Explore the Museum Model
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="w-full" style={{backgroundColor: '#f5f5f5'}}>
          <div className="max-w-[1440px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_584px] gap-0 py-12 sm:py-16 lg:py-[104px]">
              {/* Content Column */}
              <div className="px-4 sm:px-8 lg:px-[128px] flex items-center justify-start h-full">
                <div className="max-w-[581px]">
                  <h2 className="transparency-title">
                    Transparency without exposure
                  </h2>
                  <p className="transparency-description">
                    Transparency is presented as controlled documentation. Where appropriate, the platform provides read-only views designed for verification and clarity.
                  </p>
                  <button className="transparency-cta">
                    See the Stewardship Standard
                  </button>
                </div>
              </div>

              {/* List Column */}
              <div className="px-4 sm:px-8 lg:px-[80px] lg:pr-[116px]">
                <div className="transparency-list-panel">
                  <ul className="transparency-list">
                    <li>Provenance documentation</li>
                    <li>Custody and location status</li>
                    <li>Catalog structure and holdings</li>
                    <li>Governance and oversight framework</li>
                    <li>Reporting and disclosures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="w-full py-12 sm:py-16 lg:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0">
            <div className="footer-content-box flex flex-col items-center gap-10 sm:gap-12 lg:gap-10">
              {/* Logo */}
              <div className="relative w-[180px] sm:w-[200px] lg:w-[205px] h-[45px] sm:h-[50px] lg:h-[52px]">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                  alt="Art Investment Group Trust Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 205px"
                />
              </div>

              {/* Tagline */}
              <h2 className="footer-tagline">
                Governed platforms for the long-term stewardship of culturally significant art.
              </h2>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[18px]">
                <button className="footer-cta-primary">
                  Request Access
                </button>
                <button className="footer-cta-secondary">
                  Schedule a Discussion
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-3 mt-12 sm:mt-16 lg:mt-[55px]">
              {/* Links */}
              <p className="footer-links">
                Disclosures <span className="px-2">|</span> Privacy <span className="px-2">|</span> Terms <span className="px-2">|</span> Contact
              </p>

              {/* Copyright */}
              <p className="footer-copyright">
                COPYRIGHT ©2026. ALL RIGHTS RESERVED.
              </p>

              {/* Disclaimer */}
              <p className="footer-disclaimer">
                Regulatory disclosures and offering materials are provided separately and only to eligible parties. This website is presented for informational purposes and does not constitute an offer or solicitation.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

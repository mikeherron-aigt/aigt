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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] lg:pr-0 py-4">
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
                <h1 className="hero-title">
                  A Trust Structure for Cultural Assets.
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle">
                  Art Trust operates an institutional system for acquisition, custody, and long-duration stewardship of museum-grade artworks.
                </p>

                {/* Description */}
                <p className="hero-description">
                  The platform is designed to protect the work, preserve provenance, and govern participation through clear authority, disciplined process, and controlled access.
                </p>

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

          <div className="overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px]">
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
              <div className="px-4 sm:px-8 lg:px-[124px] py-12 sm:py-16 lg:py-[132px] flex items-center">
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
              <div className="relative h-[400px] sm:h-[500px] lg:h-[892px] overflow-hidden">
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
      </main>
    </div>
  );
}

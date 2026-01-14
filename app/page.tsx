import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-[140px] sm:w-[200px] lg:w-[280px] h-[35px] sm:h-[50px] lg:h-[70px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 280px"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              <a href="#system" className="nav-link">System</a>
              <a href="#funds" className="nav-link">Funds</a>
              <a href="#governance" className="nav-link">Governance</a>
              <a href="#museum" className="nav-link">Museum Infrastructure</a>
              <a href="#stewardship" className="nav-link">Stewardship</a>
              <button className="btn-primary">Contact</button>
            </nav>

            {/* Mobile Contact Button */}
            <button className="btn-primary lg:hidden"><p>Request Access</p></button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-[1440px] mx-auto relative">
          <div className="grid lg:grid-cols-[1fr_40%] gap-0">
            {/* Content Column */}
            <div className="px-4 sm:px-8 lg:px-[120px] py-12 sm:py-16 lg:py-24 flex items-center">
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
          <div className="absolute lg:left-[calc(50%-32px)] w-8 bg-white hidden lg:block pointer-events-none" style={{top: '0', height: 'calc(100% - 206px)'}}></div>
          <div className="absolute lg:left-[calc(50%-32px)] w-8 bg-ledger-stone hidden lg:block pointer-events-none" style={{top: 'calc(100% - 206px)', height: '170px'}}></div>

          {/* Footer Bar */}
          <div className="h-[36px] bg-gallery-plaster relative">
            <div className="absolute left-0 lg:left-[calc(50%-32px)] bottom-0 w-8 h-full bg-deep-patina hidden lg:block"></div>
            <div className="absolute right-0 bottom-0 w-full lg:w-1/2 h-full bg-ledger-stone hidden lg:block"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

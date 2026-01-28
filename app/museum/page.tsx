import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The John Dowling Jr. Museum of Contemporary Art",
  description: "A planned contemporary art museum conceived as a living cultural institution rooted on Long Island, extending the stewardship philosophy of Art Investment Group Trust into a permanent public space.",
};

export default function MuseumPage() {
  return (
    <div className="museum-page">
      {/* Hero Section - Full Width */}
      <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]">
        <Image
          src="/museum_hero.jpg"
          alt="John Dowling Jr. Museum of Contemporary Art exterior at dusk"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        

  {/* Hero Content */} 
<div className="absolute inset-0 flex items-center justify-center">
  <div className="w-full max-w-[1440px] mx-auto relative h-full">
    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-8 sm:p-10 lg:p-12 shadow-lg max-w-[550px] mr-6 sm:mr-8 lg:mr-0">
      <h1 
        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-6"
        style={{ fontFamily: "Georgia, serif", color: "#252e3a" }}
      >
        A Public Institution for Long-Horizon Art Stewardship
      </h1>
      <p className="text-base lg:text-lg leading-relaxed" style={{ color: "#252e3a" }}>
        The John Dowling Jr. Museum of Contemporary Art is a planned contemporary art museum conceived as a living cultural institution rooted on Long Island.
      </p>
    </div>
  </div>
</div>
      </section>

      <main>
        {/* Override max-width constraint for full-width background */}
        <section className="py-12 lg:py-20 bg-white !max-w-none w-full !mx-0 !px-0">
          <div className="w-full flex justify-center px-6 sm:px-8">
            <div className="w-full max-w-[1440px]">
              <div className="max-w-[720px] mx-auto text-center pb-8 lg:pb-12">

                {/* First paragraph - h2 - larger serif font */}
                <h2 className="text-xl lg:text-2xl leading-relaxed mb-8 font-normal" style={{ fontFamily: "Georgia, serif", color: "#252e3a" }}>
                  John Dowling Jr.'s personal history is inseparable from Long Island, where the museum is planned to take shape. Born in Queens and raised in the region, his connection to place grounds the institution in lived experience rather than abstraction, shaping how art is created, cared for, and shared.
                </h2>
                
                {/* Stylized horizontal rule */}
                <div className="relative my-12">
                  <div className="w-full border-t" style={{ borderColor: "#dadada" }}></div>
                </div>
                
                {/* Second paragraph - h3 - regular serif font */}
                <h3 className="text-lg lg:text-xl leading-relaxed font-normal" style={{ fontFamily: "Georgia, serif", color: "#252e3a" }}>
                  The museum bears his name not as recognition, but as responsibility. It reflects a lifelong commitment to artistic creation, care, and stewardship, anchoring the Trust's collections to a human narrative and a specific place while holding them to a standard designed to endure.
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* A Physical Expression of Stewardship */}
        <section className="py-12 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-[80px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div>
                <h2 className="mb-8">A Physical Expression of Stewardship</h2>
                <p className="mb-6">
                  The Dowling extends the stewardship philosophy of Art Investment Group Trust into a living cultural space. It is conceived as a place where contemporary art is not only preserved, but actively created, experienced, and shared with the public.
                </p>
                <p>
                  Through visible working studios, evolving collections, and thoughtfully designed galleries, the museum invites visitors into the creative process and the ongoing life of the work itself. The institution functions as both an exhibition space and a working archive, shaped by artistic practice over time.
                </p>
              </div>
              
              {/* Right: Image - Fixed size, right-aligned */}
              <div className="flex justify-end">
                <div className="relative w-full max-w-[450px] aspect-square rounded-sm overflow-hidden">
                  <Image
                    src="/john_working.png"
                    alt="John Dowling Jr. working in his studio"
                    fill
                    className="object-cover"
                    sizes="450px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Museum Matters - Full width background */}
        <section className="py-12 lg:py-20 bg-white !max-w-none w-full !mx-0 !px-0">
          <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="mb-6">Why This Museum Matters</h2>
              <p className="max-w-4xl mx-auto mb-6">
                Art Investment Group Trust was established to steward culturally significant art within a disciplined, governed framework. The Dowling gives that framework physical form. By creating a permanent public institution, the Trust extends its responsibility beyond ownership and into preservation, access, and continuity. The museum exists to ensure that important contemporary works are not fragmented, hidden, or lost to time, but cared for as part of a coherent cultural record.
              </p>
            </div>

            {/* 2x2 Grid of boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mt-12">
              {/* Long-Term Stewardship */}
              <div style={{ backgroundColor: "#f5f5f5" }} className="p-8 lg:p-10">
                <h3 className="mb-4">Long-Term Stewardship</h3>
                <p>
                  The museum is conceived as a permanent home for contemporary works, allowing art to be cared for, studied, and experienced over time rather than treated as a rotating display.
                </p>
              </div>

              {/* Permanent Public Access */}
              <div style={{ backgroundColor: "#f5f5f5" }} className="p-8 lg:p-10">
                <h3 className="mb-4">Permanent Public Access</h3>
                <p>
                  By establishing a physical institution, the museum provides sustained public access to significant works and artistic practice within a stable, welcoming cultural setting.
                </p>
              </div>

              {/* Living Artistic Practice */}
              <div style={{ backgroundColor: "#f5f5f5" }} className="p-8 lg:p-10">
                <h3 className="mb-4">Living Artistic Practice</h3>
                <p>
                  Through a visible working studio, the museum places artistic creation at the center of the visitor experience, allowing process and finished work to exist side by side.
                </p>
              </div>

              {/* Cultural and Human Impact */}
              <div style={{ backgroundColor: "#f5f5f5" }} className="p-8 lg:p-10">
                <h3 className="mb-4">Cultural and Human Impact</h3>
                <p>
                  Beyond exhibition, the museum supports art therapy and community-oriented programs, recognizing art's capacity to contribute to care, reflection, and public well-being.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Living Studio - Full width image then full width content section */}
        <section className="!max-w-none w-full !mx-0 !px-0">
          {/* Full-width top image */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
            <Image
              src="/museum_artists.jpg"
              alt="Museum living studio with artists working and visitors viewing"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Content section - Full width background */}
          <div className="bg-white py-12 lg:py-20 w-full">
            <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-[80px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Text Content */}
                <div>
                  <h2 className="mb-8">A Living Studio</h2>
                  
                  <p className="mb-6">
                    The Living Studio is conceived as an active site of creation within the museum, where artistic process exists in full view of the public. Artists in residence across disciplines including painting, sculpture, mixed media, and experimental practices will be invited to work on site for extended periods of time. These residencies are designed to support sustained practice rather than production schedules, allowing work to evolve through repetition, restraint, and revision.
                  </p>
                  
                  <p className="mb-6">
                    In addition to invited residents, the studio is intended to serve as a shared resource for local and regional artists. Through structured access and curated programs, members of the surrounding artistic community will be invited to utilize the space, tools, and institutional support of the museum.
                  </p>
                  
                  <p>
                    By placing creation alongside collection, the Living Studio reinforces the museum's belief that art is not only something to be preserved, but something that must be continually made. The studio exists not as a spectacle, but as a working environment that honors craft, labor, and time.
                  </p>
                </div>
                
                {/* Right: Image - Fixed size, right-aligned */}
                <div className="flex justify-end">
                  <div className="relative w-full max-w-[450px] aspect-square rounded-sm overflow-hidden">
                    <Image
                      src="/john_working2.png"
                      alt="Artist working on detailed artwork in studio"
                      fill
                      className="object-cover"
                      sizes="450px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width Museum Render */}
        <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
          <Image
            src="/museum_render.jpg"
            alt="Architectural rendering of museum at dusk"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </section>

        {/* Museum Leadership - Full width background */}
        <section className="py-12 lg:py-20 bg-white !max-w-none w-full !mx-0 !px-0">
          <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left: Circular Photo */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-[250px] h-[250px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden mb-6">
                  <Image
                    src="/ashley.png"
                    alt="Ashley Murison, Museum Director & Chief of Staff"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <h3 className="mb-2">Ashley Murison</h3>
                <p className="text-ledger-stone text-sm">Museum Director & Chief of Staff</p>
              </div>
              
              {/* Right: Gray Box with text */}
              <div className="p-8 lg:p-10" style={{ backgroundColor: "#f5f5f5" }}>
                <h2 className="mb-6">Museum Leadership</h2>
                <p className="mb-4">
                  Ashley Murison serves as Museum Director and Chief of Staff for the John Dowling Jr. Museum of Contemporary Art, overseeing institutional planning, curatorial coordination, and operational execution.
                </p>
                <p>
                  In this role, she is responsible for translating the museum's long-term vision into a functioning public institution, guiding program development, artist residencies, community engagement, and day-to-day leadership as the museum moves from planning to realization. She works closely with Art Investment Group Trust leadership to ensure alignment between artistic purpose, institutional integrity, and public responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead */}
        <section className="py-12 lg:py-20" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-[80px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div>
                <h2 className="mb-8">Looking Ahead</h2>
                
                <p className="mb-6">
                  The John Dowling Jr. Museum of Contemporary Art is currently in the planning phase. While a final site has not yet been selected and construction timelines remain under development, the institutional framework, curatorial intent, and long-term commitment behind the museum are already in place.
                </p>
                
                <p className="mb-6">
                  This museum is not conceived as a speculative concept or temporary installation. It is a deliberate extension of Art Investment Group Trust's stewardship mandate, translating long-duration ownership and custodial discipline into a permanent public institution. The planning process reflects the same measured approach that governs the Trust's collections, prioritizing durability, purpose, and cultural relevance over speed.
                </p>
                
                <p className="mb-6">
                  When realized, the Dowling will stand as a lasting cultural presence on Long Island, designed to house significant contemporary works, support ongoing artistic creation, and serve the public across generations. The renderings shown here reflect not an idea in abstraction, but a clear and considered vision for an institution built to endure.
                </p>
                
                <p className="text-base lg:text-lg leading-relaxed">
                  <span className="block">This is not a promise of immediacy.</span>
                  <span className="block">It is a commitment to permanence.</span>
                </p>

              </div>
              
              {/* Right: Image - Fixed size, right-aligned */}
              <div className="flex justify-end">
                <div className="relative w-full max-w-[450px] aspect-square rounded-sm overflow-hidden">
                  <Image
                    src="/museum_mock.png"
                    alt="Interior rendering of museum entrance lobby"
                    fill
                    className="object-cover"
                    sizes="450px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Full width background */}
        <section className="py-16 lg:py-24 bg-white !max-w-none w-full !mx-0 !px-0">
          <div className="text-center max-w-[900px] mx-auto px-6 sm:px-8">
            <h2 className="mb-8 text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: "Georgia, serif" }}>
              Governed platforms for the long-term stewardship of culturally significant art.
            </h2>
            
            <h3 className="mb-6 text-2xl sm:text-3xl" style={{ fontFamily: "Georgia, serif" }}>
              Private Conversations
            </h3>
            
            <p className="mb-6 text-base lg:text-lg leading-relaxed">
              Art Investment Group Trust engages with collectors, institutions, and qualified participants through direct, considered dialogue. We believe the stewardship of important art begins with thoughtful conversation, not transactions.
            </p>
            
            <p className="mb-10 text-base lg:text-lg leading-relaxed">
              These conversations are exploratory by design. They allow space to discuss long-term intent, governance alignment, and the role each participant seeks to play in preserving cultural value across generations.
            </p>
            
            <Link 
              href="/request-access" 
              className="inline-flex items-center justify-center px-12 py-4 text-base font-normal text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#a1a69d" }}
            >
              Schedule a Discussion
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

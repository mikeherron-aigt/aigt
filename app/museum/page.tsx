import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "The John Dowling Jr. Museum of Contemporary Art",
  description: "A planned contemporary art museum conceived as a living cultural institution rooted on Long Island, extending the stewardship philosophy of Art Investment Group Trust into a permanent public space.",
};

export default function MuseumPage() {
  return (
    <div className="museum-page">
      <main>
        {/* Hero Section - Full Bleed */}
        <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
          <Image
            src="/museum_hero.jpg"
            alt="John Dowling Jr. Museum of Contemporary Art exterior"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-12 pb-12 lg:pb-16">
              <h1 
                className="text-white font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The John Dowling Jr.<br />Museum of Contemporary Art
              </h1>
              <p className="text-white text-base sm:text-lg lg:text-xl max-w-3xl font-light leading-relaxed">
                A Public Institution for Long-Horizon Art Stewardship
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 lg:py-20">
          <div className="max-w-[800px] mx-auto">
            <p className="text-base lg:text-lg leading-relaxed mb-6">
              The John Dowling Jr. Museum of Contemporary Art is a planned contemporary art museum conceived as a living cultural institution rooted on Long Island.
            </p>
          </div>
        </section>

        {/* Why This Museum Matters */}
        <section className="py-12 lg:py-20">
          <h2>Why This Museum Matters</h2>
          <p>
            Art Investment Group Trust was established to steward culturally significant art within a disciplined, governed framework. The Dowling gives that framework physical form. By creating a permanent public institution, the Trust extends its responsibility beyond ownership and into preservation, access, and continuity. The museum exists to ensure that important contemporary works are not fragmented, hidden, or lost to time, but cared for as part of a coherent cultural record.
          </p>
        </section>

        {/* A Physical Expression of Stewardship */}
        <section className="py-12 lg:py-20">
          <h2>A Physical Expression of Stewardship</h2>
          <p>
            The Dowling extends the stewardship philosophy of Art Investment Group Trust into a living cultural space. It is conceived as a place where contemporary art is not only preserved, but actively created, experienced, and shared with the public. Through visible working studios, evolving collections, and thoughtfully designed galleries, the museum invites visitors into the creative process and the ongoing life of the work itself. The institution functions as both an exhibition space and a working archive, shaped by artistic practice over time.
          </p>
        </section>

        {/* Museum Renders - Two Column Grid */}
        <section className="py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Exterior Render */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden">
              <Image
                src="/museum_render.jpg"
                alt="Architectural rendering of museum exterior at sunset"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Living Studio Render */}
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden">
              <Image
                src="/image__5_.jpg"
                alt="Museum living studio with artists working and visitors viewing"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Why This Museum Matters - Key Points */}
        <section className="py-12 lg:py-20 bg-white/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {/* Long-Term Stewardship */}
            <div>
              <h3>Long-Term Stewardship</h3>
              <p>
                The museum is conceived as a permanent home for contemporary works, allowing art to be cared for, studied, and experienced over time rather than treated as a rotating display.
              </p>
            </div>

            {/* Permanent Public Access */}
            <div>
              <h3>Permanent Public Access</h3>
              <p>
                By establishing a physical institution, the museum provides sustained public access to significant works and artistic practice within a stable, welcoming cultural setting.
              </p>
            </div>

            {/* Living Artistic Practice */}
            <div>
              <h3>Living Artistic Practice</h3>
              <p>
                Through a visible working studio, the museum places artistic creation at the center of the visitor experience, allowing process and finished work to exist side by side.
              </p>
            </div>

            {/* Cultural and Human Impact */}
            <div>
              <h3>Cultural and Human Impact</h3>
              <p>
                Beyond exhibition, the museum supports art therapy and community-oriented programs, recognizing art's capacity to contribute to care, reflection, and public well-being.
              </p>
            </div>
          </div>
        </section>

        {/* A Living Studio */}
        <section className="py-12 lg:py-20">
          <h2>A Living Studio</h2>
          <p className="mb-8">
            The Living Studio is conceived as an active site of creation within the museum, where artistic process exists in full view of the public. Artists in residence across disciplines including painting, sculpture, mixed media, and experimental practices will be invited to work on site for extended periods of time. These residencies are designed to support sustained practice rather than production schedules, allowing work to evolve through repetition, restraint, and revision.
          </p>
          <p className="mb-8">
            In addition to invited residents, the studio is intended to serve as a shared resource for local and regional artists. Through structured access and curated programs, members of the surrounding artistic community will be invited to utilize the space, tools, and institutional support of the museum.
          </p>
          <p>
            By placing creation alongside collection, the Living Studio reinforces the museum's belief that art is not only something to be preserved, but something that must be continually made. The studio exists not as a spectacle, but as a working environment that honors craft, labor, and time.
          </p>
        </section>

        {/* Artist Image */}
        <section className="py-12 lg:py-20">
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-sm overflow-hidden">
            <Image
              src="/ChatGPT_Image_Jan_23__2026__05_48_53_PM.png"
              alt="John Dowling Jr. working in his studio"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Museum Leadership */}
        <section className="py-12 lg:py-20">
          <h2>Museum Leadership</h2>
          
          <div className="mt-8 space-y-12">
            {/* John Dowling Jr. */}
            <div className="pb-8 border-b border-gallery-plaster">
              <h3 className="mb-2">John Dowling Jr.</h3>
              <p className="text-ledger-stone text-sm mb-4">Founder</p>
              <p>
                John Dowling Jr.'s personal history is inseparable from Long Island, where the museum is planned to take shape. Born in Queens and raised in the region, his connection to place grounds the institution in lived experience rather than abstraction, shaping how art is created, cared for, and shared. The museum bears his name not as recognition, but as responsibility. It reflects a lifelong commitment to artistic creation, care, and stewardship, anchoring the Trust's collections to a human narrative and a specific place while holding them to a standard designed to endure.
              </p>
            </div>

            {/* Ashley Murison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Photo */}
              <div className="lg:col-span-1">
                <div className="relative w-full aspect-square max-w-[300px] mx-auto lg:mx-0 rounded-sm overflow-hidden">
                  <Image
                    src="/ashley.png"
                    alt="Ashley Murison, Museum Director & Chief of Staff"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 300px, 33vw"
                  />
                </div>
              </div>
              
              {/* Bio */}
              <div className="lg:col-span-2">
                <h3 className="mb-2">Ashley Murison</h3>
                <p className="text-ledger-stone text-sm mb-4">Museum Director & Chief of Staff</p>
                <p>
                  Ashley Murison serves as Museum Director and Chief of Staff for the John Dowling Jr. Museum of Contemporary Art, overseeing institutional planning, curatorial coordination, and operational execution. In this role, she is responsible for translating the museum's long-term vision into a functioning public institution, guiding program development, artist residencies, community engagement, and day-to-day leadership as the museum moves from planning to realization. She works closely with Art Investment Group Trust leadership to ensure alignment between artistic purpose, institutional integrity, and public responsibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead */}
        <section className="py-12 lg:py-20 bg-white/50">
          <h2>Looking Ahead</h2>
          <p className="mb-6">
            The John Dowling Jr. Museum of Contemporary Art is currently in the planning phase. While a final site has not yet been selected and construction timelines remain under development, the institutional framework, curatorial intent, and long-term commitment behind the museum are already in place.
          </p>
          <p className="mb-6">
            This museum is not conceived as a speculative concept or temporary installation. It is a deliberate extension of Art Investment Group Trust's stewardship mandate, translating long-duration ownership and custodial discipline into a permanent public institution. The planning process reflects the same measured approach that governs the Trust's collections, prioritizing durability, purpose, and cultural relevance over speed.
          </p>
          <p className="mb-6">
            When realized, the Dowling will stand as a lasting cultural presence on Long Island, designed to house significant contemporary works, support ongoing artistic creation, and serve the public across generations. The renderings shown here reflect not an idea in abstraction, but a clear and considered vision for an institution built to endure.
          </p>
          <p className="font-serif text-lg lg:text-xl" style={{ fontFamily: "Georgia, serif" }}>
            This is not a promise of immediacy. It is a commitment to permanence.
          </p>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-20">
          <div className="text-center max-w-[800px] mx-auto">
            <h2 className="mb-6">Stay Informed</h2>
            <p className="mb-8">
              For updates on the museum's development and to learn more about Art Investment Group Trust's stewardship philosophy, we invite you to connect with us.
            </p>
            <Link href="/request-access" className="cta-primary inline-flex">
              Request Access
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

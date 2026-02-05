import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Art in Service of People - Philanthropy",
  description: "Sharing art through stewardship, education and healing. Through philanthropy, education, and art therapy initiatives, we work to place art where it can be experienced, learned from, and used in service of human well-being.",
};

export default function PhilanthropyPage() {
  return (
    <div className="philanthropy-page">
      {/* Hero Section - Split Layout */}
      <section className="relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
          {/* Left: Text Content */}
          <div 
            className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16"
            style={{ backgroundColor: "#f8f8f8" }}
          >
            <h1 
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight mb-6"
              style={{ fontFamily: "Georgia, serif", color: "#252e3a", lineHeight: "1.1" }}
            >
              Art in Service of People
            </h1>
            
            <p 
              className="text-xl sm:text-2xl lg:text-3xl font-light mb-8"
              style={{ fontFamily: "Georgia, serif", color: "#4a4a4a", fontWeight: 300 }}
            >
              Sharing art through stewardship, education and healing
            </p>
            
            <div className="flex flex-col gap-6 max-w-2xl">
              <p 
                className="text-base lg:text-lg leading-relaxed"
                style={{ color: "#4a4a4a" }}
              >
                Art has the power to do more than be admired. When stewarded with care and shared with intention, it can educate, comfort, and connect people.
              </p>
              
              <p 
                className="text-base lg:text-lg leading-relaxed"
                style={{ color: "#4a4a4a" }}
              >
                Through philanthropy, education, and art therapy initiatives, we work to place art where it can be experienced, learned from, and used in service of human well-being.
              </p>
              
              <p 
                className="text-base lg:text-lg leading-relaxed italic mt-4"
                style={{ color: "#252e3a", fontStyle: "italic" }}
              >
                This is not about recognition. It is about responsibility.
              </p>
            </div>
          </div>
          
          {/* Right: Image */}
          <div className="relative w-full h-[400px] lg:h-auto">
            <Image
             src="/philanthropy_hero.jpg"
              alt="Young girl in yellow dress viewing art in museum"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stewardship Beyond Ownership Section */}
      <section className="w-full bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16">
            <h2 
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4"
              style={{ fontFamily: "Georgia, serif", color: "#252e3a", lineHeight: "1.2" }}
            >
              Stewardship Beyond Ownership
            </h2>
            
            <p 
              className="text-lg sm:text-xl lg:text-2xl font-light mb-8"
              style={{ fontFamily: "Georgia, serif", color: "#4a4a4a", fontWeight: 300 }}
            >
              Responsibility beyond the collection
            </p>
            
            <div className="flex flex-col gap-6 max-w-2xl">
              <p 
                className="text-base lg:text-lg leading-relaxed"
                style={{ color: "#4a4a4a" }}
              >
                Art holds responsibility beyond possession.
              </p>
              
              <p 
                className="text-base lg:text-lg leading-relaxed"
                style={{ color: "#4a4a4a" }}
              >
                Our philanthropic approach begins with long-term stewardship. That means preserving artworks with care, documenting their history, and ensuring they remain part of a living cultural conversation. Stewardship also means placing art in environments where it can be seen, studied, and understood rather than confined to private storage.
              </p>
              
              <p 
                className="text-base lg:text-lg leading-relaxed"
                style={{ color: "#4a4a4a" }}
              >
                This commitment reflects a belief that art gains meaning through context and access, not isolation.
              </p>
            </div>
          </div>
          
          {/* Right: Quote Panel */}
          <div 
            className="flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-16"
            style={{ backgroundColor: "#f8f8f8" }}
          >
            <blockquote className="max-w-xl">
              <p 
                className="text-2xl sm:text-3xl lg:text-4xl italic leading-snug mb-8"
                style={{ fontFamily: "Georgia, serif", color: "#252e3a", fontStyle: "italic", lineHeight: "1.5" }}
              >
                Art asks something of the people who care for it. Stewardship is how we answer.
              </p>
              
              <footer className="text-right">
                <p 
                  className="text-lg lg:text-xl font-medium mb-1"
                  style={{ color: "#252e3a", fontWeight: 500 }}
                >
                  John Dowling Jr.
                </p>
                <p 
                  className="text-base"
                  style={{ color: "#4a4a4a" }}
                >
                  Steward
                </p>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Globe section will go here next */}
    </div>
  );
}


"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "What is an art investment fund?",
    answer:
      "An art investment fund is a structured vehicle that acquires and holds artworks as long term assets, typically emphasizing governance, custody, and preservation rather than short term buying and selling.",
  },
  {
    question: "How does institutional art investment work?",
    answer:
      "Institutional art investment applies governance frameworks, professional custody standards, and long horizon ownership principles to the acquisition and stewardship of fine art.",
  },
  {
    question: "Who can invest in art through Art Investment Group Trust?",
    answer:
      "Participation is limited to qualified purchasers, institutions, family offices, and approved partners through private conversations and governed access.",
  },
];

export function FAQSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="max-w-[900px] mx-auto space-y-4 lg:space-y-6">
      {faqItems.map((item, index) => (
        <div key={index} className="bg-white overflow-hidden">
          <button
            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            className="w-full text-left p-6 lg:p-8 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
            aria-expanded={expandedFAQ === index}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className="m-0">{item.question}</h3>
            <svg
              className={`flex-shrink-0 w-6 h-6 text-archive-slate transition-transform duration-300 mt-1 ${
                expandedFAQ === index ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {expandedFAQ === index && (
            <div
              id={`faq-answer-${index}`}
              className="px-6 lg:px-8 pt-6 lg:pt-8 pb-6 lg:pb-8 border-t border-gallery-plaster"
            >
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

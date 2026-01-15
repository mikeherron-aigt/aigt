'use client';

import Image from "next/image";
import Link from "next/link";

export default function RequestAccessPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
      {/* Header */}
      <header className="w-full" style={{backgroundColor: '#f5f5f5'}}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-6 sm:py-8 lg:py-12">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative w-[119px] sm:w-[170px] lg:w-[238px] h-[30px] sm:h-[42px] lg:h-[60px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F5031849ff5814a4cae6f958ac9f10229%2Fd28207d51f894871ab0aee911d45e221?format=webp&width=800"
                alt="Art Investment Group Trust Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 119px, (max-width: 1024px) 170px, 238px"
              />
            </Link>

            {/* Navigation */}
            <div className="ml-auto">
              <Link href="/" className="nav-link">Back to Home</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-16 sm:py-24 lg:py-32">
        <div className="max-w-[637px] mx-auto">
          {/* Heading */}
          <h1 className="hero-title" style={{marginBottom: '24px', textAlign: 'center'}}>
            Request Access
          </h1>

          {/* Subtitle */}
          <div className="hero-subtitle" style={{textAlign: 'center', marginBottom: '40px'}}>
            <p>
              Join Art Investment Group Trust to explore opportunities in art stewardship and culturally significant acquisitions.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 sm:p-12 lg:p-16 rounded-lg">
            <form className="flex flex-col gap-6">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="request-form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="request-form-input"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="request-form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="request-form-input"
                  required
                />
              </div>

              {/* Company Field */}
              <div className="flex flex-col gap-2">
                <label className="request-form-label">Organization</label>
                <input
                  type="text"
                  placeholder="Your organization"
                  className="request-form-input"
                />
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <label className="request-form-label">Message</label>
                <textarea
                  placeholder="Tell us about your interest in AIGT"
                  className="request-form-input resize-none"
                  rows={5}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="cta-primary" style={{marginTop: '16px', width: '100%'}}>
                Submit Request
              </button>
            </form>

            {/* Info Text */}
            <p className="request-form-info" style={{marginTop: '32px', textAlign: 'center'}}>
              We take your privacy seriously. Your information will be used solely to connect with you about access to Art Investment Group Trust opportunities.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 sm:py-16 lg:py-[80px] mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0">
          <div className="footer-content-box flex flex-col items-center gap-10">
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

            {/* Copyright */}
            <p className="footer-copyright">
              COPYRIGHT ©2026. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

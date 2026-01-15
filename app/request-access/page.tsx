'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <nav className="flex items-center gap-8 ml-auto">
              <Link href="/#about" className="nav-link">About</Link>
              <Link href="/#investment-offerings" className="nav-link">Offerings</Link>
              <Link href="/#gallery" className="nav-link">Gallery</Link>
              <Link href="/#stewardship-in-practice" className="nav-link">Stewardship</Link>
              <span className="nav-separator">|</span>
              <Link href="/" className="btn-primary">Back to Home</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <div className="grid grid-cols-1 lg:grid-cols-[579px_1fr] gap-8 lg:gap-12 items-start">
            {/* Left Column - Text Content */}
            <div className="flex flex-col gap-4">
              <h1 className="request-access-title">
                Request Access
              </h1>
              <p className="request-access-description">
                Access to Art Investment Growth Trust, its platforms and conversations is considered and intentional. Requests are reviewed to ensure alignment with our stewardship philosophy and governance standards.
              </p>
            </div>

            {/* Right Column - Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="request-form-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="request-form-input-white"
                  required
                />
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="request-form-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="request-form-input-white"
                    required
                  />
                </div>
                <div className="request-form-field">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="request-form-input-white"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="request-form-field">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="request-form-input-white resize-none"
                  rows={7}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-2">
                <button type="submit" className="request-submit-button">
                  Send
                </button>
              </div>
            </form>
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

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-3">
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
        </div>
      </footer>
    </div>
  );
}

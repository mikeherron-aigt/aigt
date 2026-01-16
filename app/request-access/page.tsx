'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  country: string;
  relationshipToArt: string;
  areasOfInterest: string[];
  interestDescription: string;
  investmentHorizon: string;
  experience: string;
  followUpPreference: string;
  howYouHeard: string;
}

export default function RequestAccessPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    organization: '',
    country: '',
    relationshipToArt: '',
    areasOfInterest: [],
    interestDescription: '',
    investmentHorizon: '',
    experience: '',
    followUpPreference: '',
    howYouHeard: ''
  });

  const [charCount, setCharCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'interestDescription') {
      setCharCount(value.length);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      areasOfInterest: checked
        ? [...prev.areasOfInterest, name]
        : prev.areasOfInterest.filter(item => item !== name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Email sent successfully:', result);
        setIsSubmitted(true);
      } else {
        console.error('Failed to send email:', result);
        alert('There was an issue submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  const relationshipOptions = [
    'Collector',
    'Artist or Estate Representative',
    'Advisor or Family Office',
    'Institution',
    'Other'
  ];

  const areasOfInterestOptions = [
    'Fund participation',
    'Individual artwork acquisition',
    'Stewardship or placement discussions',
    'Research or institutional collaboration'
  ];

  const horizonOptions = [
    'Long term',
    'Very long term',
    'Exploratory'
  ];

  const followUpOptions = [
    'Email',
    'Introductory call',
    'No preference'
  ];

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
              <Link href="/about" className="nav-link">About</Link>
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
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          {isSubmitted ? (
            // Success Acknowledgement
            <div className="success-acknowledgement">
              <div className="success-icon-wrapper">
                <svg className="success-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h1 className="success-title">
                Request Received
              </h1>

              <p className="success-description">
                Thank you for your interest in Art Investment Group Trust. Your request has been received and will be reviewed carefully.
              </p>

              <p className="success-detail">
                We will be in touch within the next two weeks to discuss your request and next steps. If you have any questions in the meantime, please feel free to reach out.
              </p>

              <div className="success-actions">
                <Link href="/" className="success-button-primary">
                  Return to Home
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      organization: '',
                      country: '',
                      relationshipToArt: '',
                      areasOfInterest: [],
                      interestDescription: '',
                      investmentHorizon: '',
                      experience: '',
                      followUpPreference: '',
                      howYouHeard: ''
                    });
                    setCharCount(0);
                  }}
                  className="success-button-secondary"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-12 lg:mb-16">
                <h1 className="request-access-title mb-4">
                  Request Access
                </h1>
                <p className="request-access-description">
                  Access to Art Investment Group Trust, its platforms and conversations is considered and intentional. Requests are reviewed to ensure alignment with our stewardship philosophy and governance standards.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section 1: Identity */}
            <div className="form-section">
              <h2 className="form-section-title">Identity</h2>
              
              <div className="form-group">
                <label className="form-label">Full Name <span className="form-required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span className="form-required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization or Affiliation</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country of Residence <span className="form-required">*</span></label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Section 2: Nature of Interest */}
            <div className="form-section">
              <h2 className="form-section-title">Nature of Interest</h2>
              
              <div className="form-group">
                <label className="form-label">Relationship to Art <span className="form-required">*</span></label>
                <select
                  name="relationshipToArt"
                  value={formData.relationshipToArt}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select one</option>
                  {relationshipOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Area of Interest</label>
                <div className="space-y-3">
                  {areasOfInterestOptions.map(option => (
                    <div key={option} className="form-checkbox-group">
                      <input
                        type="checkbox"
                        id={option}
                        name={option}
                        checked={formData.areasOfInterest.includes(option)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox"
                      />
                      <label htmlFor={option} className="form-checkbox-label">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Intent and Alignment */}
            <div className="form-section">
              <h2 className="form-section-title">Intent and Alignment</h2>
              
              <div className="form-group">
                <label className="form-label">Briefly describe your interest in engaging with Art Investment Group Trust <span className="form-required">*</span></label>
                <textarea
                  name="interestDescription"
                  value={formData.interestDescription}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={5}
                  maxLength={300}
                  required
                  placeholder="Please share your interest and intent..."
                />
                <div className="form-helper-text">{charCount} / 300 characters</div>
              </div>

              <div className="form-group">
                <label className="form-label">Investment or Stewardship Horizon <span className="form-required">*</span></label>
                <select
                  name="investmentHorizon"
                  value={formData.investmentHorizon}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select one</option>
                  {horizonOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 4: Experience and Context */}
            <div className="form-section">
              <h2 className="form-section-title">Experience and Context</h2>
              
              <div className="form-group">
                <label className="form-label">Experience with art stewardship, collecting, or institutional engagement</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows={4}
                  placeholder="Optional. Share relevant background or experience..."
                />
              </div>
            </div>

            {/* Section 5: Follow Up Preferences */}
            <div className="form-section">
              <h2 className="form-section-title">Follow Up Preferences</h2>
              
              <div className="form-group">
                <label className="form-label">Preferred method of follow up <span className="form-required">*</span></label>
                <select
                  name="followUpPreference"
                  value={formData.followUpPreference}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select one</option>
                  {followUpOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">How did you hear about Art Investment Group Trust?</label>
                <input
                  type="text"
                  name="howYouHeard"
                  value={formData.howYouHeard}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Submit Button and Disclaimer */}
            <div className="mt-16 pt-12 form-submit-divider">
              <button type="submit" className="request-submit-button">
                Request Access
              </button>
              
              <p className="form-disclaimer">
                Submissions are reviewed confidentially. A request does not obligate participation or access.
              </p>
            </div>
            </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-6 lg:py-8 mt-16">
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
                <Link href="/disclosures" className="hover:opacity-70">Disclosures</Link>
                <span className="px-2">|</span>
                <Link href="/privacy" className="hover:opacity-70">Privacy</Link>
                <span className="px-2">|</span>
                <Link href="/terms" className="hover:opacity-70">Terms</Link>
                <span className="px-2">|</span>
                <Link href="/request-access" className="hover:opacity-70">Contact</Link>
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

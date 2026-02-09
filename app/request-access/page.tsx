'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trackFormSubmission } from "../lib/gtm";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      trackFormSubmission('access_request_form');

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <main className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          {isSubmitted ? (
            <section className="success-acknowledgement" aria-live="polite">
              <div className="success-icon-wrapper">
                <svg
                  className="success-checkmark"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              {/* Use global H1 for the success headline */}
              <h1>Request Received</h1>

              {/* Use global P for body copy */}
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
                  type="button"
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
            </section>
          ) : (
            <>
              {/* Header */}
              <header className="mb-12 lg:mb-16">
                {/* Use global H1 */}
                <h1 className="mb-4">Request Access</h1>

                {/* Use global P */}
                <p>
                  Access to Art Investment Group Trust, its platforms and conversations is considered and intentional. Requests are reviewed to ensure alignment with our stewardship philosophy and governance standards.
                </p>
              </header>

              {/* Info Paragraph */}
              <section className="mb-12 lg:mb-16 pb-8 lg:pb-12 border-b border-gallery-plaster">
                <p>
                  Access to Art Investment Group Trust platforms is limited to qualified purchasers, institutional participants, and approved cultural partners. Requests are reviewed to ensure alignment with our stewardship philosophy and regulatory requirements.
                </p>
              </section>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Section 1: Identity */}
                <section className="form-section">
                  {/* Keep form-section-title because it includes the divider rule */}
                  <h2 className="form-section-title">Identity</h2>

                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="form-required">*</span>
                    </label>
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
                    <label className="form-label">
                      Email Address <span className="form-required">*</span>
                    </label>
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
                    <label className="form-label">
                      Country of Residence <span className="form-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </section>

                {/* Section 2: Nature of Interest */}
                <section className="form-section">
                  <h2 className="form-section-title">Nature of Interest</h2>

                  <div className="form-group">
                    <label className="form-label">
                      Relationship to Art <span className="form-required">*</span>
                    </label>
                    <select
                      name="relationshipToArt"
                      value={formData.relationshipToArt}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select one</option>
                      {relationshipOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
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
                          <label htmlFor={option} className="form-checkbox-label">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 3: Intent and Alignment */}
                <section className="form-section">
                  <h2 className="form-section-title">Intent and Alignment</h2>

                  <div className="form-group">
                    <label className="form-label">
                      Briefly describe your interest in engaging with Art Investment Group Trust <span className="form-required">*</span>
                    </label>
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
                    <label className="form-label">
                      Investment or Stewardship Horizon <span className="form-required">*</span>
                    </label>
                    <select
                      name="investmentHorizon"
                      value={formData.investmentHorizon}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select one</option>
                      {horizonOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Section 4: Experience and Context */}
                <section className="form-section">
                  <h2 className="form-section-title">Experience and Context</h2>

                  <div className="form-group">
                    <label className="form-label">
                      Experience with art stewardship, collecting, or institutional engagement
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows={4}
                      placeholder="Optional. Share relevant background or experience..."
                    />
                  </div>
                </section>

                {/* Section 5: Follow Up Preferences */}
                <section className="form-section">
                  <h2 className="form-section-title">Follow Up Preferences</h2>

                  <div className="form-group">
                    <label className="form-label">
                      Preferred method of follow up <span className="form-required">*</span>
                    </label>
                    <select
                      name="followUpPreference"
                      value={formData.followUpPreference}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select one</option>
                      {followUpOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
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
                </section>

                {/* Submit Button and Disclaimer */}
                <section className="mt-16 pt-12 form-submit-divider">
                  <button type="submit" className="request-submit-button">
                    Request Access
                  </button>

                  <p className="form-disclaimer">
                    Submissions are reviewed confidentially. A request does not obligate participation or access.
                  </p>
                </section>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5f5f5'}}>
 

      {/* Main Content */}
      <main className="w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-[80px]">
          <h1 className="governance-title mb-12">Privacy Policy</h1>

          <div className="space-y-8">
            <div>
              <h2 className="governance-subtitle mb-4">Overview</h2>
              <p className="governance-description">
                Art Investment Group Trust is committed to protecting the privacy and confidentiality of individuals who engage with our platforms, communications, and digital properties.
              </p>
              <p className="governance-description mt-4">
                This Privacy Policy describes how information is collected, used, stored, and protected in connection with this website and related communications.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Information Collected</h2>
              <p className="governance-description">
                Information may be collected when you voluntarily submit it through forms, correspondence, or direct engagement. This may include name, contact details, affiliation, country of residence, and information provided in connection with access requests or inquiries.
              </p>
              <p className="governance-description mt-4">
                Technical information such as IP address, browser type, and usage data may also be collected through standard website analytics tools.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Use of Information</h2>
              <p className="governance-description">
                Information is used solely for purposes consistent with the mission and operations of Art Investment Group Trust, including evaluating inquiries, responding to requests, conducting communications, and maintaining operational and regulatory integrity.
              </p>
              <p className="governance-description mt-4">
                Information is not sold, rented, or shared for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Confidentiality and Security</h2>
              <p className="governance-description">
                Reasonable administrative, technical, and organizational measures are employed to protect information against unauthorized access, disclosure, or misuse. Access to information is limited to individuals with a legitimate business or governance purpose.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Disclosure of Information</h2>
              <p className="governance-description">
                Information may be disclosed where required by law, regulation, or legal process, or in connection with regulatory, compliance, or governance obligations.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Retention</h2>
              <p className="governance-description">
                Information is retained only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="governance-subtitle mb-4">Updates</h2>
              <p className="governance-description">
                This Privacy Policy may be updated periodically. Continued use of the website constitutes acceptance of any revisions.
              </p>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}

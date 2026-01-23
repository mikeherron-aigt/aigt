'use client';

import { useEffect } from 'react';

// Function to get cookie value
const getCookieValue = (name: string): string | null => {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

export default function GoogleTagManager() {
  useEffect(() => {
    // Check if user has accepted cookies
    const consentCookie = getCookieValue('aigt-cookie-consent');
    const hasConsent = consentCookie === 'true';

    if (hasConsent) {
      // Load GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GTM-W6C9KT9N';
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'GTM-W6C9KT9N');

      // Make gtag available globally
      (window as any).gtag = gtag;
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-W6C9KT9N"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
    </>
  );
}

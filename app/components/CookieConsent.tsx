'use client';

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      cookieName="aigt-cookie-consent"
      style={{
        background: "#f5f5f5",
        border: "1px solid #e0e0e0",
        fontSize: "14px",
      }}
      buttonStyle={{
        background: "#a1a69d",
        color: "#f5f5f5",
        fontSize: "14px",
        padding: "8px 24px",
        borderRadius: "0",
        fontWeight: "400",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "#252e3a",
        fontSize: "14px",
        padding: "8px 24px",
        border: "1px solid #a1a69d",
        borderRadius: "0",
        fontWeight: "400",
      }}
      expires={365}
      enableDeclineButton
      onAccept={() => {
        // Analytics and tracking scripts can now be loaded
        console.log('Cookie consent accepted');
      }}
      onDecline={() => {
        console.log('Cookie consent declined');
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <p style={{ margin: "0", color: "#252e3a", lineHeight: "1.6" }}>
          Art Investment Group Trust uses essential cookies to operate this website and optional cookies to understand how it is used. Optional cookies are only set with your consent. Learn more in our{" "}
          <Link href="/privacy" style={{ color: "#294344", textDecoration: "underline" }}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
        <span>Accept</span>
        <span>Decline</span>
      </div>
    </CookieConsent>
  );
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type InquiryPayload = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  artworkTitle: string;
  artworkCollection?: string;
  artworkCollectionId?: string | number;
};

const sanitize = (value: string) => value.trim();

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as InquiryPayload;

    const fullName = sanitize(payload.fullName || "");
    const email = sanitize(payload.email || "");
    const phone = sanitize(payload.phone || "");
    const message = sanitize(payload.message || "");
    const artworkTitle = sanitize(payload.artworkTitle || "");
    const artworkCollection = sanitize(payload.artworkCollection || "");
    const artworkCollectionId = sanitize(String(payload.artworkCollectionId || ""));

    if (!fullName || !email || !message || !artworkTitle) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (fullName.length > 120 || email.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { message: "Please keep your message under 2000 characters." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailContent = `
New Artwork Inquiry

Artwork: ${artworkTitle}
Collection: ${artworkCollection || "Not provided"}
Collection ID: ${artworkCollectionId || "Not provided"}

Name: ${fullName}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
    `.trim();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "admin@aigt.art",
      subject: `Artwork Inquiry: ${artworkTitle}`,
      text: emailContent,
    });

    // Send confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your Inquiry Has Been Received - Art Investment Group Trust",
      text: `Dear ${fullName},

Thank you for your inquiry about "${artworkTitle}".

Your message has been received and will be reviewed by our team. We will be in touch shortly to discuss your inquiry and next steps.

If you have any questions in the meantime, please feel free to reach out.

Best regards,
Art Investment Group Trust`,
    };

    await transporter.sendMail(confirmationEmail);

    return NextResponse.json(
      { success: true, message: "Inquiry sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Artwork inquiry error:", error);
    return NextResponse.json(
      { message: "Failed to send inquiry. Please try again later." },
      { status: 500 }
    );
  }
}

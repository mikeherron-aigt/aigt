import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Configure your email service here
    // Using environment variables for security
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Format the email content
    const emailContent = `
New Contact Form Submission

IDENTITY
Full Name: ${formData.fullName}
Email: ${formData.email}
Organization: ${formData.organization || 'Not provided'}
Country: ${formData.country}

NATURE OF INTEREST
Relationship to Art: ${formData.relationshipToArt}
Areas of Interest: ${formData.areasOfInterest && formData.areasOfInterest.length > 0 ? formData.areasOfInterest.join(', ') : 'Not specified'}

INTENT AND ALIGNMENT
Interest Description: ${formData.interestDescription}
Investment Horizon: ${formData.investmentHorizon}

EXPERIENCE AND CONTEXT
Experience: ${formData.experience || 'Not provided'}

FOLLOW UP PREFERENCES
Preferred Follow Up: ${formData.followUpPreference}
How They Heard: ${formData.howYouHeard || 'Not provided'}

---
Submission received from: ${formData.email}
    `.trim();

    // Send email to admin
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'admin@aigt.art',
      subject: `New Contact Form Submission from ${formData.fullName}`,
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: formData.email,
      subject: 'Your Request Has Been Received - Art Investment Group Trust',
      text: `Dear ${formData.fullName},\n\nThank you for your interest in Art Investment Group Trust. Your request has been received and will be reviewed carefully.\n\nWe will be in touch within the next two weeks to discuss your request and next steps.\n\nIf you have any questions in the meantime, please feel free to reach out.\n\nBest regards,\nArt Investment Group Trust`,
    };

    await transporter.sendMail(confirmationEmail);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email', error: String(error) },
      { status: 500 }
    );
  }
}

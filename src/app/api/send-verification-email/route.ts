import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const verificationEmailHTML = (therapistName: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fdf6f0; border-radius: 16px;">
  <h1 style="color: #4A90D9; font-size: 24px;">MindBridge</h1>
  <h2 style="color: #333;">You're now a Verified Therapist! 🎉</h2>
  <p style="color: #666;">Hi ${therapistName},</p>
  <p style="color: #666;">
    We're thrilled to welcome you to the MindBridge family! Your profile has been reviewed and 
    <strong>officially verified</strong> by our team. You are now live on the platform and patients can find and book sessions with you.
  </p>
  <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 8px 0; color: #333;"><strong>✅ Profile Status:</strong> Verified & Live</p>
    <p style="margin: 8px 0; color: #333;"><strong>📅 Next Step:</strong> Log in and set your weekly availability</p>
    <p style="margin: 8px 0; color: #333;"><strong>💬 Patients:</strong> Can now find and book sessions with you</p>
    <p style="margin: 8px 0; color: #333;"><strong>🔔 Bookings:</strong> You'll receive an email for every new booking request</p>
  </div>
  <p style="color: #666;">
    Please make sure your availability is up to date on your therapist dashboard so patients can book the right slots.
  </p>
  <div style="background: #f0f7ff; border-radius: 12px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0; color: #4A90D9; font-size: 14px;">
      🌐 Login at <a href="https://mindbridge-delta.vercel.app/login" style="color: #4A90D9;">mindbridge-delta.vercel.app/login</a>
    </p>
  </div>
  <p style="color: #666;">
    If you have any questions, feel free to reach out to us at 
    <a href="mailto:yourmindbridge@gmail.com" style="color: #4A90D9;">yourmindbridge@gmail.com</a>
  </p>
  <p style="color: #C084A0; font-style: italic;">"Like flowers that grow through concrete, your healing begins the moment you reach for the light." 🌸</p>
  <p style="color: #999; font-size: 12px; margin-top: 32px;">MindBridge — Your Mental Health Companion</p>
</div>
`;

export async function POST(req: Request) {
  const { therapistEmail, therapistName } = await req.json();

  try {
    await transporter.sendMail({
      from: `"MindBridge" <${process.env.GMAIL_USER}>`,
      to: therapistEmail,
      subject: "You're verified on MindBridge! 🎉",
      html: verificationEmailHTML(therapistName),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
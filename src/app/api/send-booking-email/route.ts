import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const emailHTML = (title: string, greeting: string, body: string, details: Record<string, string>) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fdf6f0; border-radius: 16px;">
  <h1 style="color: #4A90D9; font-size: 24px;">MindBridge</h1>
  <h2 style="color: #333;">${title}</h2>
  <p style="color: #666;">${greeting}</p>
  <p style="color: #666;">${body}</p>
  <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
    ${Object.entries(details).map(([k, v]) => `<p style="margin: 8px 0; color: #333;"><strong>${k}:</strong> ${v}</p>`).join("")}
  </div>
  <p style="color: #666;">If you have any questions, feel free to reach out to us at yourmindbridge@gmail.com</p>
  <p style="color: #C084A0; font-style: italic;">"Like flowers that grow through concrete, your healing begins the moment you reach for the light." 🌸</p>
  <p style="color: #999; font-size: 12px; margin-top: 32px;">MindBridge — Your Mental Health Companion</p>
</div>
`;

export async function POST(req: Request) {
  const { userEmail, userName, therapistName, therapistEmail, date, time, sessionType, concern, isProBono, fee } = await req.json();

  const details = {
    Therapist: therapistName,
    Date: date,
    Time: time,
    "Session Type": sessionType,
    "Focus Area": concern,
    Fee: isProBono ? "Free (Pro Bono)" : `₹${fee}`,
  };

  try {
    // Email to patient
    await transporter.sendMail({
      from: `"MindBridge" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Your session has been requested 🌸",
      html: emailHTML(
        "Session Requested! 🎉",
        `Hi ${userName},`,
        `Your session request has been sent to <strong>${therapistName}</strong>. They will confirm within 24 hours.`,
        details
      ),
    });

    // Email to therapist (if email provided)
    if (therapistEmail) {
      await transporter.sendMail({
        from: `"MindBridge" <${process.env.GMAIL_USER}>`,
        to: therapistEmail,
        subject: "New session request 🌸",
        html: emailHTML(
          "New Booking Request!",
          `Hi ${therapistName},`,
          `You have a new session request from <strong>${userName}</strong>. Please confirm or reject it from your dashboard.`,
          details
        ),
      });
    }

    // Email to admin
    await transporter.sendMail({
      from: `"MindBridge" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New booking: ${userName} with ${therapistName}`,
      html: emailHTML(
        "New Booking Alert",
        "A new session has been requested.",
        `Patient: <strong>${userName}</strong> (${userEmail}) has booked with <strong>${therapistName}</strong>.`,
        details
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userEmail, userName, therapistName, date, time, sessionType, concern, isProBono, fee } = await req.json();

  try {
    // Email to user
    await resend.emails.send({
      from: "MindBridge <onboarding@resend.dev>",
      to: userEmail,
      subject: "Your session has been requested 🌸",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fdf6f0; border-radius: 16px;">
          <h1 style="color: #4A90D9; font-size: 24px;">MindBridge</h1>
          <h2 style="color: #333;">Session Requested! 🎉</h2>
          <p style="color: #666;">Hi ${userName},</p>
          <p style="color: #666;">Your session request has been sent to <strong>${therapistName}</strong>. They will confirm within 24 hours.</p>
          
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 8px 0; color: #333;"><strong>Therapist:</strong> ${therapistName}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Session Type:</strong> ${sessionType}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Focus Area:</strong> ${concern}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Fee:</strong> ${isProBono ? "Free (Pro Bono)" : `₹${fee}`}</p>
          </div>

          <p style="color: #666;">If you have any questions, feel free to reach out to us.</p>
          <p style="color: #C084A0; font-style: italic;">"Like flowers that grow through concrete, your healing begins the moment you reach for the light." 🌸</p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">MindBridge — Your Mental Health Companion</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const emailHTML = (title: string, greeting: string, body: string, details: Record<string, string>, meetingLink?: string) => `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fdf6f0; border-radius: 16px;">
  <h1 style="color: #4A90D9; font-size: 24px;">MindBridge</h1>
  <h2 style="color: #333;">${title}</h2>
  <p style="color: #666;">${greeting}</p>
  <p style="color: #666;">${body}</p>
  <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
    ${Object.entries(details).map(([k, v]) => `<p style="margin: 8px 0; color: #333;"><strong>${k}:</strong> ${v}</p>`).join("")}
  </div>
  ${meetingLink ? `
  <div style="background: #e8f5e9; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
    <p style="color: #2e7d32; font-weight: bold; margin-bottom: 12px;">🎥 Video Call Link</p>
    <p style="color: #555; font-size: 13px; margin-bottom: 16px;">Click the button below at the scheduled time to join your session.</p>
    <a href="${meetingLink}" style="background: #4CAF50; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Join Video Call</a>
  </div>
  ` : ""}
  <p style="color: #666;">If you have any questions, feel free to reach out to us at yourmindbridge@gmail.com</p>
  <p style="color: #C084A0; font-style: italic;">"Like flowers that grow through concrete, your healing begins the moment you reach for the light." 🌸</p>
  <p style="color: #999; font-size: 12px; margin-top: 32px;">MindBridge — Your Mental Health Companion</p>
</div>
`;

export async function POST(req: Request) {
  const { patientUserId, patientName, therapistName, therapistUserId, meetingLink, date, time, sessionType } = await req.json();

  const details = {
    Therapist: therapistName,
    Patient: patientName,
    Date: date,
    Time: time,
    "Session Type": sessionType,
    Status: "✅ Confirmed",
  };

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: patientData } = await supabaseAdmin.auth.admin.getUserById(patientUserId);
    const patientEmail = patientData?.user?.email || "";

    const { data: therapistData } = await supabaseAdmin.auth.admin.getUserById(therapistUserId);
    const therapistEmail = therapistData?.user?.email || "";

    const videoMeetingLink = sessionType === "Video Call" ? meetingLink : undefined;

    if (patientEmail) {
      await transporter.sendMail({
        from: `"MindBridge" <${process.env.GMAIL_USER}>`,
        to: patientEmail,
        subject: "Your session is confirmed! 🎉",
        html: emailHTML(
          "Session Confirmed! 🎉",
          `Hi ${patientName},`,
          `Great news! <strong>${therapistName}</strong> has confirmed your session. See you soon!`,
          details,
          videoMeetingLink
        ),
      });
    }

    if (therapistEmail) {
      await transporter.sendMail({
        from: `"MindBridge" <${process.env.GMAIL_USER}>`,
        to: therapistEmail,
        subject: "Session confirmed 🌸",
        html: emailHTML(
          "You confirmed a session!",
          `Hi ${therapistName},`,
          `You have confirmed a session with <strong>${patientName}</strong>. Here are the details:`,
          details,
          videoMeetingLink
        ),
      });
    }

    await transporter.sendMail({
      from: `"MindBridge" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Session confirmed: ${patientName} with ${therapistName}`,
      html: emailHTML(
        "Session Confirmed Alert",
        "A session has been confirmed.",
        `<strong>${therapistName}</strong> confirmed a session with <strong>${patientName}</strong>.`,
        details,
        videoMeetingLink
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirmation email error:", error);
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 });
  }
}
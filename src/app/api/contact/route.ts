import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESENDEMAIL);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Send notification email to admin
    const { error: adminError } = await resend.emails.send({
      from: "Prepzy <support@prepzy.tech>",
      to: "sharyarmalik430@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050F2A; color: #F2FDFF; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0a1a3a, #050F2A); padding: 32px; border-bottom: 1px solid rgba(123,191,255,0.2);">
            <h1 style="margin: 0; font-size: 24px; color: #7BBFFF;">New Contact Message</h1>
            <p style="margin: 8px 0 0; color: #99b3cc; font-size: 14px;">Someone reached out via the Prepzy contact form</p>
          </div>
          <div style="padding: 32px;">
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #7BBFFF; letter-spacing: 1px;">Name</p>
              <p style="margin: 0; font-size: 16px; color: #F2FDFF;">${name}</p>
            </div>
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #7BBFFF; letter-spacing: 1px;">Email</p>
              <p style="margin: 0; font-size: 16px; color: #F2FDFF;"><a href="mailto:${email}" style="color: #7BBFFF; text-decoration: none;">${email}</a></p>
            </div>
            <div style="margin-bottom: 0;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #7BBFFF; letter-spacing: 1px;">Message</p>
              <p style="margin: 0; font-size: 16px; color: #F2FDFF; line-height: 1.6; background: rgba(123,191,255,0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(123,191,255,0.1);">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (adminError) {
      console.error("Admin email error:", adminError);
      return NextResponse.json(
        { error: "Failed to send notification email." },
        { status: 500 }
      );
    }

    // 2. Send thank-you email to the user
    const { error: userError } = await resend.emails.send({
      from: "Prepzy <support@prepzy.tech>",
      to: email,
      subject: "Thank you for contacting Prepzy!",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050F2A; color: #F2FDFF; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0a1a3a, #050F2A); padding: 32px; text-align: center; border-bottom: 1px solid rgba(123,191,255,0.2);">
            <h1 style="margin: 0; font-size: 28px; color: #7BBFFF;">Thank You, ${name}!</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #B0C8E0; line-height: 1.7; margin: 0 0 16px;">
              We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you as soon as possible.
            </p>
            <div style="background: rgba(123,191,255,0.05); border: 1px solid rgba(123,191,255,0.15); border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; color: #7BBFFF; letter-spacing: 1px;">Your message</p>
              <p style="margin: 0; font-size: 14px; color: #99b3cc; line-height: 1.6;">${message}</p>
            </div>
            <p style="font-size: 14px; color: #99b3cc; margin: 0;">
              — The Prepzy Team
            </p>
          </div>
          <div style="padding: 20px 32px; border-top: 1px solid rgba(123,191,255,0.1); text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #99b3cc;">Smarter Prep Starts Here</p>
          </div>
        </div>
      `,
    });

    if (userError) {
      console.error("User thank-you email error:", userError);
      // Don't fail the whole request since the admin was notified
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

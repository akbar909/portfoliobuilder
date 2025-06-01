import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/server-utils";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required." }), { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    // For security, do not reveal if user exists
    return new Response(JSON.stringify({ message: "If that email is registered, a reset link has been sent." }), { status: 200 });
  }
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 20px; background-color: #f6f9fc; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="https://img.freepik.com/free-vector/portfolio-management-previous-projects-samples-works-catalog-skills-presentation-successful-business-projects-completion-vector-isolated-concept-metaphor-illustration_335657-2952.jpg" alt="Portfolio Builder Logo" style="display: block; margin: 0 auto 30px; max-width: 200px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px; text-align: center;">Reset Your Password</h1>
          <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin-bottom: 30px;">Hi,</p>
          <p style="color: #4a5568; font-size: 16px; line-height: 24px;">We received a request to reset your password for your Portfolio Builder account. Click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #fff; font-size: 18px; font-weight: bold; padding: 14px 32px; border-radius: 6px; text-decoration: none;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center;">If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px; text-align: center;">For your security, this link will expire in 1 hour.</p>
        </div>
      </body>
    </html>
  `;
  await sendEmail({ to: email, subject: "Reset your password", html });
  return new Response(JSON.stringify({ message: "If that email is registered, a reset link has been sent." }), { status: 200 });
} 
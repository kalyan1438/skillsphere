import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate OTP
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
  
const FROM = process.env.RESEND_FROM || "kalyan143811@gmail.com";


// ================= OTP EMAIL =================
export const sendOTPEmail = async ({ to, name, otp, courseName }) => {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Your OTP for Course Registration — SkillSphere Academy",
      html: `
      <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
          <p style="color:#64748b;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd</p>
        </div>

        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested to register for <strong>${courseName}</strong>.</p>

        <div style="background:#EBF3FF;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
          <p style="color:#1A6BCC;font-size:12px;font-weight:700;">YOUR OTP</p>
          <div style="font-size:42px;font-weight:800;letter-spacing:10px;">${otp}</div>
          <p style="font-size:12px;">Valid for 10 minutes</p>
        </div>

        <p style="font-size:13px;">Ignore if not requested.</p>
      </div>
      `,
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    throw new Error("Failed to send OTP email");
  }
};


// ================= CONFIRMATION =================
export const sendRegistrationConfirmation = async ({ to, name, courseName }) => {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Registration Confirmed — ${courseName}`,
      html: `
      <div style="font-family:sans-serif;padding:24px;">
        <h2>Hi ${name},</h2>
        <p>Your registration for <strong>${courseName}</strong> is confirmed 🎉</p>
        <p>We will contact you within 24 hours.</p>
      </div>
      `,
    });
  } catch (err) {
    console.error("CONFIRMATION EMAIL ERROR:", err);
    throw new Error("Failed to send confirmation email");
  }
};


// ================= ANNOUNCEMENT =================
export const sendAnnouncementBlast = async ({ recipients, title, description }) => {
  let sent = 0;

  for (let i = 0; i < recipients.length; i++) {
    try {
      await resend.emails.send({
        from: FROM,
        to: recipients[i],
        subject: `[SkillSphere] ${title}`,
        html: `
        <div style="font-family:sans-serif;padding:24px;">
          <h2>${title}</h2>
          <p>${description.replace(/\n/g, "<br/>")}</p>
        </div>
        `,
      });
      sent++;
    } catch (err) {
      console.error("ANNOUNCEMENT ERROR:", err);
    }
  }

  return sent;
};
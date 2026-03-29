import nodemailer from 'nodemailer';

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const FROM = `"SkillSphere Soft Solutions Pvt Ltd" <${process.env.SMTP_USER}>`;

// ================= OTP EMAIL =================
export const sendOTPEmail = async ({ to, name, otp, courseName }) => {
  try {
    await createTransporter().sendMail({
      from: FROM,
      to,
      subject: 'Your OTP for Course Registration — SkillSphere Academy',
      html: `
      <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
        <div style="margin-bottom:24px;">
          <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
          <p style="color:#64748b;font-size:12px;margin-top:2px;">SkillSphere Soft Solutions Pvt Ltd</p>
        </div>
        <p style="color:#0f172a;">Hi <strong>${name}</strong>,</p>
        <p style="color:#334155;">You requested to register for <strong>${courseName}</strong>. Use the OTP below to verify your email.</p>
        <div style="background:#EBF3FF;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
          <p style="color:#1A6BCC;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:10px;">YOUR VERIFICATION OTP</p>
          <div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#0F172A;font-family:monospace;">${otp}</div>
          <p style="color:#94a3b8;font-size:12px;margin-top:12px;">Valid for <strong>10 minutes</strong> only</p>
        </div>
        <p style="color:#64748b;font-size:13px;">If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
        <p style="color:#94a3b8;font-size:12px;">
          SkillSphere Soft Solutions Pvt Ltd<br/>
          Door No:13-11/B, Near Vignan University, Vadlamudi, Guntur, AP - 522213
        </p>
      </div>`,
    });
  } catch (err) {
    console.error('BREVO OTP ERROR:', err);
    throw new Error('Failed to send OTP email');
  }
};

// ================= CONFIRMATION =================
export const sendRegistrationConfirmation = async ({ to, name, courseName }) => {
  try {
    await createTransporter().sendMail({
      from: FROM,
      to,
      subject: `Registration Confirmed — ${courseName}`,
      html: `
      <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
        <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
        <p style="color:#0f172a;margin-top:20px;">Hi <strong>${name}</strong>,</p>
        <p style="color:#334155;">Your registration for <strong>${courseName}</strong> is confirmed! 🎉</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin:20px 0;">
          <p style="color:#16a34a;font-weight:600;margin:0;">✅ Registration Successful</p>
          <p style="color:#15803d;font-size:13px;margin:4px 0 0;">Our team will contact you within 24 hours.</p>
        </div>
        <p style="color:#64748b;font-size:13px;">For queries: <strong>+91-9849460990</strong></p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
        <p style="color:#94a3b8;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd, Vadlamudi, Guntur, AP</p>
      </div>`,
    });
  } catch (err) {
    console.error('BREVO CONFIRMATION ERROR:', err);
    throw new Error('Failed to send confirmation email');
  }
};

// ================= ANNOUNCEMENT =================
export const sendAnnouncementBlast = async ({ recipients, title, description }) => {
  const transporter = createTransporter();
  let sent = 0;
  const BATCH = 50;

  for (let i = 0; i < recipients.length; i += BATCH) {
    try {
      const bcc = recipients.slice(i, i + BATCH).join(',');
      await transporter.sendMail({
        from: FROM,
        bcc,
        subject: `[SkillSphere] ${title}`,
        html: `
        <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
          <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
          <h2 style="color:#0f172a;margin-top:20px;">${title}</h2>
          <div style="color:#334155;line-height:1.7;">${description.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
          <p style="color:#94a3b8;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd, Vadlamudi, Guntur, AP</p>
        </div>`,
      });
      sent += bcc.split(',').filter(Boolean).length;
    } catch (err) {
      console.error('BREVO ANNOUNCEMENT ERROR:', err);
    }
  }
  return sent;
};

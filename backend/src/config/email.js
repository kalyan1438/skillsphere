import nodemailer from 'nodemailer';

const transporter = () =>
  nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

const FROM = `"SkillSphere Soft Solutions" <${process.env.SMTP_USER}>`;

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPEmail = async ({ to, name, otp, courseName }) => {
  await transporter().sendMail({
    from: FROM, to,
    subject: 'Your OTP for Course Registration — SkillSphere Academy',
    html: `
    <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <div style="background:#1A6BCC;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:14px;font-weight:800;">S</span>
        </div>
        <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
      </div>
      <p style="color:#64748b;font-size:12px;margin-bottom:24px;">SkillSphere Soft Solutions Pvt Ltd</p>
      <p style="color:#0f172a;">Hi <strong>${name}</strong>,</p>
      <p style="color:#334155;">You requested to register for <strong>${courseName}</strong>. Use the OTP below to verify your email.</p>
      <div style="background:#EBF3FF;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
        <p style="color:#1A6BCC;font-size:12px;font-weight:700;letter-spacing:2px;margin-bottom:10px;">YOUR VERIFICATION OTP</p>
        <div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#0F172A;font-family:monospace;">${otp}</div>
        <p style="color:#94a3b8;font-size:12px;margin-top:12px;">⏱ Valid for <strong>10 minutes</strong> only</p>
      </div>
      <p style="color:#64748b;font-size:13px;">If you did not request this, please ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
      <p style="color:#94a3b8;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd<br/>
        Door No:13-11/B, Near Vignan University, Vadlamudi, Guntur - Tenali Road, AP - 522213<br/>
        +91-9849460990
      </p>
    </div>`,
  });
};

export const sendRegistrationConfirmation = async ({ to, name, courseName }) => {
  await transporter().sendMail({
    from: FROM, to,
    subject: `Registration Confirmed — ${courseName} | SkillSphere Academy`,
    html: `
    <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
        <div style="background:#1A6BCC;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:14px;font-weight:800;">S</span>
        </div>
        <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
      </div>
      <p style="color:#0f172a;">Hi <strong>${name}</strong>,</p>
      <p style="color:#334155;">Your registration for <strong>${courseName}</strong> has been received! 🎉</p>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin:20px 0;">
        <p style="color:#16a34a;font-weight:600;margin:0;">✅ Registration Successful</p>
        <p style="color:#15803d;font-size:13px;margin:4px 0 0;">Our team will contact you within 24 hours to confirm your batch details.</p>
      </div>
      <p style="color:#64748b;font-size:13px;">For queries, call us:<br/>
        <strong>+91-9849460990 / +91-7569440980 / +91-9392342265</strong>
      </p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
      <p style="color:#94a3b8;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd, Vadlamudi, Guntur, AP</p>
    </div>`,
  });
};

export const sendAnnouncementBlast = async ({ recipients, title, description }) => {
  const t = transporter();
  const BATCH = 50;
  let sent = 0;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const bcc = recipients.slice(i, i + BATCH).join(',');
    await t.sendMail({
      from: FROM, bcc,
      subject: `[SkillSphere] ${title}`,
      html: `
      <div style="font-family:sans-serif;max-width:540px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:14px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
          <div style="background:#1A6BCC;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:14px;font-weight:800;">S</span>
          </div>
          <span style="font-weight:800;font-size:18px;color:#0f172a;">SKILL<span style="color:#1A6BCC;">SPHERE</span></span>
        </div>
        <h2 style="color:#0f172a;">${title}</h2>
        <div style="color:#334155;line-height:1.7;">${description.replace(/\n/g,'<br/>')}</div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
        <p style="color:#94a3b8;font-size:12px;">SkillSphere Soft Solutions Pvt Ltd, Vadlamudi, Guntur, AP</p>
      </div>`,
    });
    sent += bcc.split(',').filter(Boolean).length;
  }
  return sent;
};

import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import { generateOTP, sendOTPEmail, sendRegistrationConfirmation } from '../config/email.js';

// POST /api/registrations/request  — Step 1: send OTP
export const requestRegistration = async (req, res, next) => {
  try {
    const { name, email, phone, courseId } = req.body;

    if (!name || !email || !phone || !courseId)
      return res.status(400).json({ success: false, message: 'name, email, phone, courseId are required' });

    const emailReg = /^\S+@\S+\.\S+$/;
    if (!emailReg.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email address' });

    const phoneReg = /^[\d\s\+\-]{10,15}$/;
    if (!phoneReg.test(phone))
      return res.status(400).json({ success: false, message: 'Invalid phone number' });

    const course = await Course.findById(courseId);
    if (!course || !course.isActive)
      return res.status(404).json({ success: false, message: 'Course not found' });

    // Check already verified registration for same email+course
    const alreadyDone = await Registration.findOne({ email, course: courseId, isVerified: true, status: { $ne: 'Cancelled' } });
    if (alreadyDone)
      return res.status(409).json({ success: false, message: 'You are already registered for this course' });

    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert unverified record (resend OTP support)
    const reg = await Registration.findOneAndUpdate(
      { email, course: courseId, isVerified: false },
      { name, phone, otp, otpExpires },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOTPEmail({ to: email, name, otp, courseName: course.title });

    res.json({ success: true, message: `OTP sent to ${email}. Valid for 10 minutes.`, registrationId: reg._id });
  } catch (err) { next(err); }
};

// POST /api/registrations/verify-otp  — Step 2: verify and complete
export const verifyOTP = async (req, res, next) => {
  try {
    const { registrationId, otp } = req.body;
    if (!registrationId || !otp)
      return res.status(400).json({ success: false, message: 'registrationId and otp required' });

    const reg = await Registration.findById(registrationId).select('+otp +otpExpires');
    if (!reg)
      return res.status(404).json({ success: false, message: 'Registration not found' });
    if (reg.isVerified)
      return res.status(400).json({ success: false, message: 'Already verified' });
    if (reg.otp !== otp.trim())
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    if (reg.otpExpires < new Date())
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });

    reg.isVerified  = true;
    reg.otp         = undefined;
    reg.otpExpires  = undefined;
    await reg.save();

    await Course.findByIdAndUpdate(reg.course, { $inc: { enrolledCount: 1 } });

    const course = await Course.findById(reg.course).select('title');
    await sendRegistrationConfirmation({ to: reg.email, name: reg.name, courseName: course?.title || 'your course' });

    await reg.populate('course', 'title duration price');
    res.json({ success: true, message: 'Registration confirmed! Check your email for details.', data: reg });
  } catch (err) { next(err); }
};

// POST /api/registrations/resend-otp
export const resendOTP = async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    const reg = await Registration.findById(registrationId).select('+otp +otpExpires');
    if (!reg || reg.isVerified)
      return res.status(400).json({ success: false, message: 'Invalid request' });

    const otp        = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    reg.otp         = otp;
    reg.otpExpires  = otpExpires;
    await reg.save();

    const course = await Course.findById(reg.course).select('title');
    await sendOTPEmail({ to: reg.email, name: reg.name, otp, courseName: course?.title || 'Course' });

    res.json({ success: true, message: 'New OTP sent to your email.' });
  } catch (err) { next(err); }
};

// GET /api/registrations  (admin)
export const getRegistrations = async (req, res, next) => {
  try {
    const { status, course } = req.query;
    const filter = { isVerified: true };
    if (status) filter.status = status;
    if (course) filter.course = course;

    const regs = await Registration.find(filter)
      .populate('course', 'title duration price')
      .select('-otp -otpExpires')
      .sort('-createdAt');
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) { next(err); }
};

// PATCH /api/registrations/:id/status  (admin)
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const reg = await Registration.findByIdAndUpdate(
      req.params.id, { status, notes }, { new: true, runValidators: true }
    ).populate('course', 'title');

    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    if (status === 'Cancelled')
      await Course.findByIdAndUpdate(reg.course._id, { $inc: { enrolledCount: -1 } });

    res.json({ success: true, message: 'Status updated', data: reg });
  } catch (err) { next(err); }
};

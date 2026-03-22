import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name:    { type: String, required: [true, 'Name required'], trim: true },
  email:   { type: String, required: [true, 'Email required'], lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  phone:   { type: String, required: [true, 'Phone required'], match: [/^[\d\s\+\-]{10,15}$/, 'Invalid phone'] },
  course:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  // OTP verification
  isVerified: { type: Boolean, default: false },
  otp:        { type: String, select: false },
  otpExpires: { type: Date,   select: false },

  // Admin managed
  status:  { type: String, enum: ['Pending','Confirmed','Cancelled'], default: 'Pending' },
  notes:   { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Course from '../models/Course.js';
import Registration from '../models/Registration.js';
import Announcement from '../models/Announcement.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/admin/login
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({
      success: true,
      token: signToken(admin._id),
      data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) { next(err); }
};

// GET /api/admin/me
export const getMe = (req, res) =>
  res.json({ success: true, data: req.admin });

// GET /api/admin/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const [courses, registrations, pending, confirmed, announcements, recentReg] = await Promise.all([
      Course.countDocuments({ isActive: true }),
      Registration.countDocuments({ isVerified: true }),
      Registration.countDocuments({ isVerified: true, status: 'Pending' }),
      Registration.countDocuments({ isVerified: true, status: 'Confirmed' }),
      Announcement.countDocuments(),
      Registration.find({ isVerified: true }).populate('course','title').sort('-createdAt').limit(5),
    ]);
    res.json({ success: true, data: { courses, registrations, pending, confirmed, announcements, recentReg } });
  } catch (err) { next(err); }
};

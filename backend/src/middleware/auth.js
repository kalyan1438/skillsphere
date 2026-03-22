import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const admin   = await Admin.findById(decoded.id);
    if (!admin)
      return res.status(401).json({ success: false, message: 'Admin not found' });

    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
};

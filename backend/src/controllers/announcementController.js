import Announcement from '../models/Announcement.js';
import Registration from '../models/Registration.js';
import { sendAnnouncementBlast } from '../config/email.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    const list = await Announcement.find({ isActive: true }).sort('-createdAt').limit(10);
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

export const getAllAnnouncements = async (req, res, next) => {
  try {
    const list = await Announcement.find().sort('-createdAt');
    res.json({ success: true, data: list });
  } catch (err) { next(err); }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, sendEmail } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, message: 'title and description required' });

    const ann = await Announcement.create({ title, description });
    let emailCount = 0;

    if (sendEmail) {
      const regs = await Registration.find({ isVerified: true }).select('email');
      const emails = [...new Set(regs.map(r => r.email))];
      if (emails.length) emailCount = await sendAnnouncementBlast({ recipients: emails, title, description });
    }

    res.status(201).json({
      success: true,
      message: sendEmail ? `Announcement created and emailed to ${emailCount} students` : 'Announcement created',
      data: ann,
    });
  } catch (err) { next(err); }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findByIdAndDelete(req.params.id);
    if (!ann) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) { next(err); }
};

import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: [true, 'Title required'], trim: true },
  description: { type: String, required: [true, 'Description required'], trim: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);

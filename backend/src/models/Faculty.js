import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Name required'], trim: true },
  qualification: { type: String, required: [true, 'Qualification required'], trim: true },
  experience:    { type: String, required: [true, 'Experience required'], trim: true },
  expertise:     [{ type: String, trim: true }],
  bio:           { type: String, trim: true },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Faculty', facultySchema);

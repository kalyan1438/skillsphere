import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name:          { type: String, required: [true, 'Name required'], trim: true },
  qualification: { type: String, required: [true, 'Qualification required'], trim: true },
  experience:    { type: String, required: [true, 'Experience required'], trim: true },
  expertise:     [{ type: String, trim: true }],
  bio:           { type: String, trim: true },
  email:         { type: String, trim: true, lowercase: true },  // optional, no unique
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// Drop any old unique index on email if exists
facultySchema.index({ email: 1 }, { unique: false, sparse: true });

export default mongoose.model('Faculty', facultySchema);
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: [true, 'Title required'], trim: true, unique: true },
  description: { type: String, required: [true, 'Description required'], trim: true },
  duration:    { type: String, required: [true, 'Duration required'], trim: true },
  price:       { type: Number, required: [true, 'Price required'], min: 0 },
  level:       { type: String, enum: ['Beginner','Intermediate','Advanced','All Levels'], default: 'Beginner' },
  syllabus:    [{ type: String, trim: true }],
  isActive:    { type: Boolean, default: true },
  totalSeats:  { type: Number, default: 30 },
  enrolledCount: { type: Number, default: 0 },
}, { timestamps: true });

courseSchema.virtual('seatsRemaining').get(function () {
  return this.totalSeats - this.enrolledCount;
});
courseSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Course', courseSchema);

import Course from '../models/Course.js';

// GET /api/courses  (public)
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true }).sort('title');
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) { next(err); }
};

// GET /api/courses/all  (admin — includes inactive)
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort('-createdAt');
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) { next(err); }
};

// GET /api/courses/:id  (public)
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

// POST /api/courses  (admin)
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, duration, price, level, syllabus, totalSeats } = req.body;
    if (!title || !description || !duration || price === undefined)
      return res.status(400).json({ success: false, message: 'title, description, duration, price are required' });

    const course = await Course.create({ title, description, duration, price, level, syllabus, totalSeats });
    res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (err) { next(err); }
};

// PUT /api/courses/:id  (admin)
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course updated', data: course });
  } catch (err) { next(err); }
};

// DELETE /api/courses/:id  (admin — soft delete)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course removed' });
  } catch (err) { next(err); }
};

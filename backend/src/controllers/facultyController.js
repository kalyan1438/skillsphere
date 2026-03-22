import Faculty from '../models/Faculty.js';

export const getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort('name');
    res.json({ success: true, count: faculty.length, data: faculty });
  } catch (err) { next(err); }
};

export const getAllFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find().sort('-createdAt');
    res.json({ success: true, count: faculty.length, data: faculty });
  } catch (err) { next(err); }
};

export const createFaculty = async (req, res, next) => {
  try {
    const { name, qualification, experience, expertise, bio } = req.body;
    if (!name || !qualification || !experience)
      return res.status(400).json({ success: false, message: 'name, qualification, experience required' });
    const faculty = await Faculty.create({ name, qualification, experience, expertise, bio });
    res.status(201).json({ success: true, message: 'Faculty added', data: faculty });
  } catch (err) { next(err); }
};

export const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty updated', data: faculty });
  } catch (err) { next(err); }
};

export const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, message: 'Faculty removed' });
  } catch (err) { next(err); }
};

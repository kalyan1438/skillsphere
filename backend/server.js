import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import adminRoutes        from './src/routes/adminRoutes.js';
import courseRoutes       from './src/routes/courseRoutes.js';
import facultyRoutes      from './src/routes/facultyRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import registrationRoutes from './src/routes/registrationRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes);
app.use('/api/courses',       courseRoutes);
app.use('/api/faculty',       facultyRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/registrations', registrationRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', message: 'SkillSphere API running 🚀' }));

app.use(notFound);
app.use(errorHandler);

connectDB().then(() =>
  app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`))
);

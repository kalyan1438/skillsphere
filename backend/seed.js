import 'dotenv/config';
import mongoose from 'mongoose';
import Admin    from './src/models/Admin.js';
import Course   from './src/models/Course.js';
import Faculty  from './src/models/Faculty.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected');

// Admin
const adminExists = await Admin.findOne({ email: 'admin@skillsphere.in' });
if (!adminExists) {
  await Admin.create({ name: 'Super Admin', email: 'admin@skillsphere.in', password: 'Admin@1234', role: 'superadmin' });
  console.log('✅ Admin: admin@skillsphere.in / Admin@1234');
} else console.log('ℹ️  Admin exists');

// Courses
const courses = [
  { title: 'Full Stack Web Development', description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build and deploy complete web applications.', duration: '4 Months', price: 25000, level: 'Beginner', syllabus: ['HTML & CSS','JavaScript ES6+','React.js','Node.js & Express','MongoDB','Deployment'] },
  { title: 'Python & Machine Learning',  description: 'Learn Python programming, data analysis, and ML algorithms. Build real models with Scikit-learn and TensorFlow.', duration: '5 Months', price: 30000, level: 'Intermediate', syllabus: ['Python Basics','NumPy & Pandas','Data Visualization','Scikit-learn','Deep Learning','Projects'] },
  { title: 'Android App Development',    description: 'Build Android apps with Java & Kotlin. Covers UI design, REST APIs, Firebase, and Play Store publishing.', duration: '3 Months', price: 18000, level: 'Beginner', syllabus: ['Java/Kotlin','Android Studio','UI/UX','Firebase','REST APIs','Play Store'] },
  { title: 'Cloud Computing & DevOps',   description: 'AWS core services, Docker, Kubernetes, CI/CD. Prepare for AWS Cloud Practitioner certification.', duration: '4 Months', price: 28000, level: 'Intermediate', syllabus: ['AWS Core','Linux','Docker','Kubernetes','CI/CD','Security'] },
  { title: 'Cyber Security',             description: 'Ethical hacking, network security, VAPT tools. Aligned with CEH & CompTIA Security+ paths.', duration: '3 Months', price: 22000, level: 'All Levels', syllabus: ['Networking','Kali Linux','VAPT','Ethical Hacking','Firewalls','CEH Prep'] },
  { title: 'Data Analytics & Power BI',  description: 'Excel, SQL, Power BI & Tableau. Turn raw data into insights. Perfect for non-programmers too.', duration: '2 Months', price: 15000, level: 'Beginner', syllabus: ['Excel','SQL Basics','Power BI','Tableau','Dashboards','Case Studies'] },
];
for (const c of courses) {
  if (!await Course.findOne({ title: c.title })) {
    await Course.create(c); console.log(`✅ Course: ${c.title}`);
  } else console.log(`ℹ️  Course exists: ${c.title}`);
}

// Faculty
const faculty = [
  { name: 'Dr. Ramesh Kumar',   qualification: 'Ph.D Computer Science, IIT Hyderabad', experience: '12 Years', expertise: ['Machine Learning','Python','Data Science'],      bio: 'Industry veteran with 12 years in ML and AI research.' },
  { name: 'Mrs. Anitha Reddy',  qualification: 'M.Tech Software Engineering, JNTU',    experience: '8 Years',  expertise: ['Full Stack','React','Node.js','MongoDB'],         bio: 'Full stack developer and passionate educator.' },
  { name: 'Mr. Suresh Babu',    qualification: 'B.Tech IT, Vignan University',          experience: '6 Years',  expertise: ['Android','Java','Kotlin','Firebase'],             bio: 'Android developer with apps on Play Store with 100K+ downloads.' },
  { name: 'Ms. Priya Sharma',   qualification: 'M.Sc Cyber Security, Osmania University', experience: '5 Years', expertise: ['Cyber Security','Ethical Hacking','Networking'], bio: 'Certified ethical hacker and network security expert.' },
];
for (const f of faculty) {
  if (!await Faculty.findOne({ name: f.name })) {
    await Faculty.create(f); console.log(`✅ Faculty: ${f.name}`);
  } else console.log(`ℹ️  Faculty exists: ${f.name}`);
}

await mongoose.disconnect();
console.log('\n🚀 Seed complete!');

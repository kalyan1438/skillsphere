import { useState, useEffect } from 'react';
import { getCourses, getFaculty, getAnnouncements } from '@/api';
import type { Course, Faculty, Announcement, ApiError } from '@/types';
import RegisterModal from '@/components/RegisterModal';
import toast from 'react-hot-toast';

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'badge-green',
  Intermediate: 'badge-yellow',
  Advanced:     'badge-red',
  'All Levels': 'badge-blue',
};

const TESTIMONIALS = [
  { name: 'Ravi Kumar',    role: 'Full Stack Developer at TechCorp',  rating: 5, text: 'SkillSphere gave me the practical skills I needed. Got placed within a month of completing the Full Stack course. Highly recommend!' },
  { name: 'Priya Reddy',   role: 'Data Analyst at InfoSys',           rating: 5, text: 'The Python & ML course was incredibly detailed. Real projects made the difference. The faculty guidance was excellent.' },
  { name: 'Arjun Sharma',  role: 'Android Developer at Wipro',        rating: 5, text: 'Small batch size meant I got personal attention. The placement support was real — mock interviews prepared me perfectly.' },
  { name: 'Sneha Varma',   role: 'Cloud Engineer at TCS',             rating: 5, text: 'Cloud & DevOps course was very well structured. Hands-on labs on actual AWS infrastructure made learning easy.' },
];

const HomePage = () => {
  const [courses,       setCourses]       = useState<Course[]>([]);
  const [faculty,       setFaculty]       = useState<Faculty[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    getCourses().then(r => { setCourses(r.data.data || []); setLoadingCourses(false); }).catch(() => setLoadingCourses(false));
    getFaculty().then(r => setFaculty(r.data.data || [])).catch(() => {});
    getAnnouncements().then(r => setAnnouncements(r.data.data || [])).catch(() => {});
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) { toast.error('Fill all required fields'); return; }
    setContactLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will contact you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setContactLoading(false);
  };

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80" alt="Library" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <div className="inline-block bg-primary/20 border border-primary/40 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm tracking-widest uppercase">
              SkillSphere Academy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Build your skills<br/>today. <span className="text-blue-400">It's affordable.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              Explore our industry-ready, hands-on IT courses. Learn to build networks, develop apps, and secure devices. Join our academy and become a global problem solver.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#courses" className="btn-primary px-8 py-3.5 text-base">Explore Academy</a>
              <a href="#contact" className="btn-ghost px-8 py-3.5 text-base">Contact Us</a>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              {[['500+','Students Trained'],['15+','Courses'],['92%','Placement Rate'],['5+','Years']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold text-white">{n}</div>
                  <div className="text-white/60 text-xs mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-tag">About Us</span>
              <h2 className="section-title">Empowering Students with Industry-Ready Skills</h2>
              <p className="section-sub">
                We specialize in IT education and academic projects for B.Tech, M.Tech, MCA students. Our goal is to bridge the gap between academic knowledge and industry requirements through hands-on training and real-world projects.
              </p>
              <ul className="mt-6 space-y-3">
                {['Hands-on project-based curriculum','Industry-experienced trainers','Small batch sizes for personalized attention','Placement assistance & mock interviews','Weekend & weekday batch options'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"/>
                Why Choose SkillSphere?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏆', title: 'Expert Trainers',    desc: 'Industry professionals with real experience' },
                  { icon: '🛠️', title: 'Live Projects',      desc: 'Build portfolio-ready projects' },
                  { icon: '📋', title: 'Interview Prep',     desc: 'Mock interviews & resume building' },
                  { icon: '🎓', title: 'Certification',      desc: 'Industry-recognized certificates' },
                  { icon: '📅', title: 'Flexible Batches',   desc: 'Weekday, weekend & fast-track' },
                  { icon: '🤝', title: 'Placement Help',     desc: '50+ hiring partners across India' },
                ].map(item => (
                  <div key={item.title} className="bg-slate-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ── */}
      {announcements.length > 0 && (
        <section id="announcements" className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"/>
              <span className="text-white/80 text-xs font-bold tracking-widest uppercase">Latest Announcements</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map(a => (
                <div key={a._id} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-colors">
                  <div className="font-bold text-white mb-2">{a.title}</div>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{a.description}</p>
                  <div className="text-white/40 text-xs mt-3">{new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COURSES ── */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="section-tag">Our Programs</span>
            <h2 className="section-title">Courses Designed for the Industry</h2>
            <p className="section-sub max-w-xl">Practical, hands-on programs taught by industry professionals. Every course includes live projects and placement support.</p>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse"/>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No courses available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course._id} className="card group flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`${LEVEL_COLORS[course.level] || 'badge-blue'}`}>{course.level}</span>
                    <span className="text-primary font-extrabold text-lg">₹{course.price.toLocaleString()}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{course.description}</p>
                  {course.syllabus?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.syllabus.slice(0, 4).map(s => (
                        <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{s}</span>
                      ))}
                      {course.syllabus.length > 4 && <span className="text-xs text-slate-400">+{course.syllabus.length - 4} more</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>⏱ {course.duration}</span>
                      <span>🪑 {course.seatsRemaining ?? (course.totalSeats - course.enrolledCount)} seats</span>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      disabled={course.seatsRemaining === 0}
                      className="btn-primary py-2 px-4 text-xs"
                    >
                      {course.seatsRemaining === 0 ? 'Full' : 'Register Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FACULTY ── */}
      <section id="faculty" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="section-tag">Our Team</span>
            <h2 className="section-title">Expert Faculty</h2>
            <p className="section-sub max-w-xl">Learn from professionals with real industry experience — not just textbook knowledge.</p>
          </div>
          {faculty.length === 0 ? (
            <div className="text-center py-16 text-slate-400">Faculty details coming soon.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {faculty.map(f => (
                <div key={f._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 text-xl font-extrabold text-primary">
                    {f.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{f.name}</h3>
                  <p className="text-primary text-xs font-medium mb-1">{f.qualification}</p>
                  <p className="text-slate-400 text-xs mb-3">{f.experience} Experience</p>
                  {f.bio && <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{f.bio}</p>}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {f.expertise?.slice(0, 3).map(e => (
                      <span key={e} className="text-xs bg-blue-50 text-primary border border-blue-200 px-2 py-0.5 rounded-full">{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="section-tag">Student Reviews</span>
            <h2 className="section-title">What Our Students Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-yellow-400 text-sm mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADDRESS + CONTACT ── */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Info */}
            <div>
              <span className="section-tag">Find Us</span>
              <h2 className="section-title mb-6">Get In Touch</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-lg">📍</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Address</div>
                    <div className="text-slate-700 text-sm leading-relaxed">
                      Door No: 13-11/B, Near Vignan University,<br/>
                      Vadlamudi, Guntur - Tenali Road,<br/>
                      Andhra Pradesh - 522213
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-lg">📞</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Phone</div>
                    <div className="text-slate-700 text-sm space-y-0.5">
                      <div>+91-9849460990</div>
                      <div>+91-7569440980</div>
                      <div>+91-9392342265</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-lg">📧</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</div>
                    <div className="text-slate-700 text-sm">SkillSphere@gmail.com</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0 text-lg">🕐</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Timings</div>
                    <div className="text-slate-700 text-sm space-y-0.5">
                      <div><span className="font-medium">Mon – Sat:</span> 9 AM – 9 PM</div>
                      <div><span className="font-medium">Sunday:</span> 9 AM – 1 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input className="input" placeholder="Your name" value={contactForm.name}
                      onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required/>
                  </div>
                  <div>
                    <label className="label">Phone *</label>
                    <input className="input" placeholder="+91 XXXXX XXXXX" value={contactForm.phone}
                      onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} required/>
                  </div>
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input className="input" type="email" placeholder="you@email.com" value={contactForm.email}
                    onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required/>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input resize-none h-24" placeholder="Any questions..." value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}/>
                </div>
                <p className="text-xs text-slate-400">* Your details will not be shared with third parties.</p>
                <button type="submit" disabled={contactLoading} className="btn-primary w-full py-3">
                  {contactLoading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-extrabold text-lg">SKILL<span className="text-blue-400">SPHERE</span> Soft Solutions Pvt Ltd</div>
            <div className="text-slate-400 text-xs mt-1">Vadlamudi, Guntur, Andhra Pradesh - 522213</div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#courses" className="hover:text-white transition-colors">Courses</a>
            <a href="#faculty" className="hover:text-white transition-colors">Faculty</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-slate-500 text-xs">© 2025 SkillSphere. All rights reserved.</div>
        </div>
      </footer>

      {/* Register Modal */}
      {selectedCourse && <RegisterModal course={selectedCourse} onClose={() => setSelectedCourse(null)}/>}
    </div>
  );
};

export default HomePage;

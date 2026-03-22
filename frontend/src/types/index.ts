export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  syllabus: string[];
  isActive: boolean;
  totalSeats: number;
  enrolledCount: number;
  seatsRemaining: number;
  createdAt: string;
}

export interface Faculty {
  _id: string;
  name: string;
  qualification: string;
  experience: string;
  expertise: string[];
  bio?: string;
  isActive: boolean;
}

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: { _id: string; title: string; duration: string; price: number };
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  isVerified: boolean;
  notes?: string;
  createdAt: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  courses: number;
  registrations: number;
  pending: number;
  confirmed: number;
  announcements: number;
  recentReg: Registration[];
}

export interface ApiError {
  response?: { data?: { message?: string } };
}

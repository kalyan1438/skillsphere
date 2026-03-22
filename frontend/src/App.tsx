import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import Navbar          from '@/components/Navbar';
import ProtectedRoute  from '@/components/ProtectedRoute';
import HomePage        from '@/pages/home/HomePage';
import AdminLogin      from '@/pages/admin/AdminLogin';
import AdminLayout     from '@/pages/admin/AdminLayout';
import AdminDashboard  from '@/pages/admin/AdminDashboard';
import AdminCourses    from '@/pages/admin/AdminCourses';
import AdminFaculty    from '@/pages/admin/AdminFaculty';
import AdminRegistrations  from '@/pages/admin/AdminRegistrations';
import AdminAnnouncements  from '@/pages/admin/AdminAnnouncements';

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="pt-0">{children}</div>
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage/></PublicLayout>} />
        <Route path="/admin/login" element={<AdminLogin/>} />

        {/* Admin protected */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
          <Route index                  element={<AdminDashboard/>} />
          <Route path="courses"         element={<AdminCourses/>} />
          <Route path="faculty"         element={<AdminFaculty/>} />
          <Route path="registrations"   element={<AdminRegistrations/>} />
          <Route path="announcements"   element={<AdminAnnouncements/>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

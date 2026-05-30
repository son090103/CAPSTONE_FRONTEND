import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Lazy-loaded components
const Header = lazy(() => import("./pages/customer/Header"));
const Home = lazy(() => import("./pages/customer/Home/Home"));
const Services = lazy(() => import("./pages/customer/services/Services"));
const Parts = lazy(() => import("./pages/customer/Parts/Parts"));
const BookingPage = lazy(() => import("./pages/customer/Booking/BookingPage"));
const Signup = lazy(() => import("./pages/customer/Home/SingUp"));
const Footer = lazy(() => import("./pages/customer/Footer"));
const Login = lazy(() => import("./pages/customer/Home/Login"));
const UserProfile = lazy(() => import("./pages/customer/UserProfile/UserProfile"));
const ForgotPassword = lazy(() => import("./pages/customer/Home/ForgotPassword"));
const Team = lazy(() => import("./pages/customer/Team/Team"));
const OtpVerification = lazy(() => import("./pages/customer/Home/verify-otp"));
const VerifyPhone = lazy(() => import("./pages/customer/Home/verify-phone"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard/AdminDashboard"));
const AdminSettings = lazy(() => import("./pages/admin/settings/AdminSettings"));
const AdminServicesCategories = lazy(() => import("./pages/admin/services/AdminServicesCategories"));
const AdminResources = lazy(() => import("./pages/admin/resources/AdminResources"));
const AdminServiceCatalog = lazy(() => import("./pages/admin/services/AdminServiceCatalog"));
const AdminStaffManagement = lazy(() => import("./pages/admin/staff/AdminStaffManagement"));
const AdminSpareParts = lazy(() => import("./pages/admin/parts/AdminSpareParts"));

// Premium loading fallback styled to match AGM Intelligent branding
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-slate-50/50 backdrop-blur-xs flex flex-col items-center justify-center z-50">
    <div className="relative w-16 h-16">
      {/* Outer spinning ring */}
      <div className="absolute inset-0 rounded-full border-4 border-[#00285E]/10 border-t-[#00285E] animate-spin"></div>
      {/* Inner pulsing circle */}
      <div className="absolute inset-3 rounded-full bg-[#F9A11B]/80 animate-pulse"></div>
    </div>
    <span className="mt-4 text-xs font-bold text-[#00285E] tracking-widest uppercase animate-pulse">
      Đang tải hệ thống...
    </span>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="" element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="parts" element={<Parts />} />
          <Route path="phone-service" element={<BookingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="team" element={<Team />} />
          <Route path="otp-verification" element={<OtpVerification />} />
          <Route path="verify-phone" element={<VerifyPhone />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminDashboard />} />
          <Route path="spare-part" element={<AdminSpareParts />} />
          <Route path="services-category" element={<AdminServicesCategories />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="services" element={<AdminServiceCatalog />} />
          <Route path="staff" element={<AdminStaffManagement />} />
        </Route>
      </Routes>
      {!isAdminPath && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
    </Suspense>
  );
}

export default App;

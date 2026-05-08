import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlansPage from './pages/PlansPage';
import DashboardPage from './pages/DashboardPage';
import AdminSubscriptionsPage from './pages/AdminSubscriptionsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/plans" element={<PlansPage />} />

                {/* Protected user routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                {/* Admin only routes */}
                <Route
                  path="/admin/subscriptions"
                  element={<AdminRoute><AdminSubscriptionsPage /></AdminRoute>}
                />

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/plans" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

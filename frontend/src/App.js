import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentSubject from './pages/StudentSubject';
import AdminDashboard from './pages/AdminDashboard';
import ManageSubjects from './pages/ManageSubjects';
import ManageTopics from './pages/ManageTopics';
import ManageContent from './pages/ManageContent';
import MaterialDetails from './pages/MaterialDetails';
import QuizPage from './pages/QuizPage';
import MaterialView from './pages/MaterialView';
import AdminMaterialView from './pages/AdminMaterialView';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-subject/:subjectId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSubject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-subjects/:examId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageSubjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-topics/:subjectId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageTopics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-content/:topicId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageContent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials/:topicId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MaterialDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:topicId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/material/:materialId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MaterialView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/material/:materialId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMaterialView />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

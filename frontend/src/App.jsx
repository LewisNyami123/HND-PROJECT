import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Layout from './components/Layout';
import Exams from './pages/Exams';
import Results from './pages/Result';
import CountdownPage from './pages/CountDownPage';
import Profile from './pages/Profile';
import FacultyCreateExam from './pages/FacultyCreateExam';
import FacultyRooms from './pages/FacultyRooms';
import FacultyQuestions from './pages/FacultyQuestions';
import FacultyScheduleExam from './pages/FacultyScheduleExam';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import NotFound from './pages/NotFound';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminResults from './pages/AdminResults';
import TakeExam from './pages/TakeExam';
import FacultyCreateCA from './pages/FacultyCreateCA';
import Register from './pages/Register';

const App = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'student';
  const isAuthenticated = !!token;

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Root route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? role === "student"
                ? <Navigate to="/exams" replace />
                : role === "faculty"
                ? <Navigate to="/faculty" replace />
                : <Navigate to="/admin" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected routes */}
        <Route
          element={isAuthenticated ? <Layout role={role} /> : <Navigate to="/login" replace />}
        >
          {/* Student routes */}
          {role === "student" && (
            <>
              <Route path="exams" element={<Exams />} />
              <Route path="results" element={<Results />} />
               <Route path="countdown" element={<CountdownPage  />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/take/:examId" element={<TakeExam />} />
            </>
          )}

          {/* Faculty routes */}
         {role === "faculty" && (
          <>
            <Route path="falculty/create" element={<FacultyCreateExam />} />
            <Route path="falculty/createCA" element={<FacultyCreateCA />} />
            <Route path="falculty/rooms" element={<FacultyRooms />} />
            <Route path="falculty/questions" element={<FacultyQuestions />} />
            <Route path="falculty/schedule" element={<FacultyScheduleExam />} />
            <Route path="falculty/profile" element={<Profile />} />
            {/* Default faculty route */}
            <Route index element={<Navigate to="falculty/create" replace />} />
          </>
    )}

          {/* Admin routes (placeholder) */}
                {role === "admin" && (
          <>
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="admin/results"element = {<AdminResults />} />
             <Route path="admin/profile" element={<Profile />} />
             <Route path='admin/register' element={<Register/>} />
              {/* Default admin route */}
            <Route index element={<Navigate to="admin/users" replace />} />
          </>
        )}

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
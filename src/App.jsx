import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './pages/Login';
import PostSelectionPage from './pages/PostSelectionPage';
import CheckInPage from './pages/CheckInPage';
import JobCreatePage from './pages/JobCreatePage/JobCreatePage';
import JobSearchPage from './pages/JobSearchPage/JobSearchPage';
import EventSearchPage from './pages/EventSearchPage/EventSearchPage';
import EventCreatePage from './pages/EventCreatePage/EventCreatePage';
import VolunteerPage from './pages/VolunteerPage/VolunteerPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './styles/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/post-selection"
          element={
            <PrivateRoute>
              <PostSelectionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <PrivateRoute>
              <CheckInPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="home-container">
                <Sidebar />
                <main className="main-content">
                  <Home />
                </main>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/job-create"
          element={
            <PrivateRoute>
              <div className="home-container">
                <JobCreatePage />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/job-search"
          element={
            <PrivateRoute>
              <div className="home-container">
                <JobSearchPage />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/event-search"
          element={
            <PrivateRoute>
              <div className="home-container">
                <EventSearchPage />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/event-create"
          element={
            <PrivateRoute>
              <div className="home-container">
                <EventCreatePage />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <PrivateRoute>
              <div className="home-container">
                <VolunteerPage />
              </div>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

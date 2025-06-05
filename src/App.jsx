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
import './styles/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>     
        <Route path="/" element={<Navigate to="/login" replace />} />       
        <Route path="/login" element={<Login />} />        
        <Route path="/post-selection" element={<PostSelectionPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/dashboard" element={
          <div className="home-container">
            <Sidebar />
            <main className="main-content">
              <Home />
            </main>
          </div>
        } />
        <Route path="/job-create" element={
          <div className="home-container">
            <JobCreatePage />
          </div>
        } />
        <Route path="/job-search" element={
          <div className="home-container">
            <JobSearchPage />
          </div>
        } />
        <Route path="/event-search" element={
          <div className="home-container">
            <EventSearchPage />
          </div>
        } />
        <Route path="/event-create" element={
          <div className="home-container">
            <EventCreatePage />
          </div>
        } />       
        <Route path="/volunteer" element={
          <div className="home-container">
            <VolunteerPage />
          </div>
        } />       
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
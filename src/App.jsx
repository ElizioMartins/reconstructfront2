import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import FormPage from './pages/FormPage';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import PostSelectionPage from './pages/PostSelectionPage';
import CheckInPage from './pages/CheckInPage';
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
        <Route path="/dynamic_form/:templateId/:formId/:type" element={
          <div className="home-container">
            <Sidebar />
            <main className="main-content">
              <FormPage />
            </main>
          </div>
        } />        
        <Route path="/test-page" element={
          <div className="home-container">
            <Sidebar />
            <main className="main-content">
              <TestPage />
            </main>
          </div>
        } />        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
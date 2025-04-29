import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import FormPage from './components/pages/FormPage';
import TestPage from './components/pages/TestPage';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="home-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dynamic_form/:templateId/:formId/:type" element={<FormPage />} />
            <Route path="/test-page" element={<TestPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
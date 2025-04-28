import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FormPage from './components/pages/FormPage';
import TestPage from './components/pages/TestPage';

const ErrorPage = () => {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dynamic_form/:templateId/:formId/:type"
          element={<FormPage />}
        />
        <Route path="/test-page" element={<TestPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

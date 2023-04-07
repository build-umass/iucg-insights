// Description: Root component
// This is the root component of the application. 
// It is responsible for rendering the main page and the create page.
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import Create from './create';

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  </BrowserRouter>
);

export default Root;

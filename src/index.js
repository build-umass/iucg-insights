// This is the entry point for the application
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import Create from './components/Create/Create';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create" element={<Create />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

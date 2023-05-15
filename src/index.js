// This is the entry point for the application
import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import Create from './components/Create/Create';
import BlogDisplay from './components/BlogDisplay/BlogDisplay'

ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles/:id" element={<BlogDisplay/>} />
      </Routes>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// This is the entry point for the application
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
// import Create from './components/Create/Create';
import CreateEdit from './components/CreateEdit/CreateEdit';
import BlogDisplay from './components/BlogDisplay/BlogDisplay'
import SearchPage from './components/SearchPage/SearchPage';

const root = createRoot(document.getElementById("root"))
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreateEdit />} />
        <Route path="/create/:id" element={<CreateEdit />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/articles/:id" element={<BlogDisplay/>} />
        <Route path="/search/" element={<SearchPage/>} />
      </Routes>
    </CookiesProvider>
  </BrowserRouter>
)

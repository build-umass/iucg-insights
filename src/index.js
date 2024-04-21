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
import { GoogleOAuthProvider } from '@react-oauth/google';
import Settings from './components/Settings/Settings';
import Drafts from './components/Drafts/Drafts';
import AuthorDisplay from './components/AuthorDisplay/AuthorDisplay';
import AuthorCreateEdit from './components/AuthorCreateEdit/AuthorCreateEdit';

const root = createRoot(document.getElementById("root"))
root.render(
  <GoogleOAuthProvider clientId='55337590525-411lsekong4ho3gritf5sbpgckpgq9ev.apps.googleusercontent.com'>
    <BrowserRouter>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create" element={<CreateEdit />} />
          <Route path="/create/:id" element={<CreateEdit />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/articles/:id" element={<BlogDisplay />} />
          <Route path="/authors/:id" element={<AuthorDisplay />} />
          <Route path="/createauthor/" element={<AuthorCreateEdit />} />
          <Route path="/createauthor/:id" element={<AuthorCreateEdit />} />
          <Route path="/search/" element={<SearchPage />} />
          <Route path="/settings/" element={<Settings />} />
          <Route path="/drafts/" element={<Drafts />} />
        </Routes>
      </CookiesProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)

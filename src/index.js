// This is the entry point for the application
import React from 'react';
import * as ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Routes, Route, ScrollRestoration, createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import "./common.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage/>,
  },
  {
    path: "create",
    element: <CreateEdit/>
  },
  {
    path: "create/:id",
    element: <CreateEdit/>
  },
  {
    path: "articles/:id",
    element: <BlogDisplay/>
  },
  {
    path: "authors/:id",
    element: <AuthorDisplay/>
  },
  {
    path: "createauthor",
    element: <AuthorCreateEdit/>
  },
  {
    path: "createauthor/:id",
    element: <AuthorCreateEdit/>
  },
  {
    path: "settings",
    element: <Settings/>
  },
  {
    path: "drafts",
    element: <Drafts/>
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId='55337590525-411lsekong4ho3gritf5sbpgckpgq9ev.apps.googleusercontent.com'>
      <CookiesProvider>
        <RouterProvider router={router}/>
      </CookiesProvider>
    </GoogleOAuthProvider>
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export const REPO_NAME = "fvf-decks"

const Redir = () => <Navigate to={`/${REPO_NAME}`} replace />

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path={`/${REPO_NAME}`} Component={App} />
        <Route path="*" Component={Redir} />
      </Routes>
    </Router>
  </React.StrictMode>
);

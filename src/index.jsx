import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HolidayFX from './HolidayFX';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="*"
          Component={(props) => (
            <>
              <HolidayFX />
              <App {...props} />
            </>
          )}
        />
      </Routes>
    </Router>
  </React.StrictMode>,
);

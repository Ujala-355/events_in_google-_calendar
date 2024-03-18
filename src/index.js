import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createClient} from "@supabase/supabase-js";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
const supabase=createClient(
    "https://ckdlyirsxcftolrmulcl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGx5aXJzeGNmdG9scm11bGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0OTQ3NzYsImV4cCI6MjAyNjA3MDc3Nn0.GzAZAAd1HbDV1DizENJ7Twn2sjv-Kso8oQfJ9fTSKdI"
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
          <App/>
      </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

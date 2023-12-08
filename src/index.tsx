import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

import App          from './App';
import Login        from "./pages/Login";
import Registration from "./pages/Registration";
import Upload       from "./pages/Upload";
import PersonalPage from './pages/PersonalPage';
import PostUpdate   from './pages/PostUpdate';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/"             Component={App} />
          <Route path="/Login"        Component={Login} />
          <Route path="/Register"     Component={Registration} />
          <Route path="/Upload"       Component={Upload} />
          <Route path="/PersonalPage" Component={PersonalPage}/>
          <Route path="/PostUpdate"   Component={PostUpdate}/>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

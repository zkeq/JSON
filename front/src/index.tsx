import type { ReactElement } from 'react'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    HashRouter as Router,
    Route,
    Routes
} from 'react-router-dom'

// pages
import Login from './pages/login'

import DashboardLayout from "./layout/dashboard";
import Index from "./pages/index";
import 'antd/dist/antd.min.css'

const App: React.FC = (props: any) : ReactElement => {
  return (
    <Router>
        <Routes>
              <Route path='/' element={<DashboardLayout />}>
                  <Route index element={<Index />} />
                  <Route path="/json" element={<Index />} />
              </Route>
            <Route path='login' element={<Login />} />
        </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);

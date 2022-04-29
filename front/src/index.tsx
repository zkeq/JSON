import type { ReactElement } from 'react'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter as Router,
  Link,
  Route,
  Routes
} from 'react-router-dom'
import 'antd/dist/antd.min.css'

// pages
import Login from './pages/login'

import DashboardLayout from "./layout/dashboard";
import Index from "./pages/index";
import { Button, Result } from 'antd';

const App: React.FC = (props: any): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<Index />} />
          <Route path="/json" element={<Index />} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path="*" element={<Result
          status="404"
          title="404"
          subTitle="Page Not Fount"
          extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
        />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);

import type { ReactElement } from 'react'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  HashRouter as Router,
  Link,
  Route,
  Routes
} from 'react-router-dom'
import {
  Button,
  Result,
} from 'antd';
import 'antd/dist/antd.min.css'

// pages
import loadable from './support/loadable';

const DashboardLayout = loadable({ loader: () => import('./layout/dashboard') });
const Index = loadable({ loader: () => import('./pages/index') });
const Setting = loadable({ loader: () => import('./pages/setting') });
const Login = loadable({ loader: () => import('./pages/login') });

const App: React.FC = (props: any): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DashboardLayout />}>
          <Route index element={<Index />} />
          <Route path="/control" element={<Index />} />
          <Route path="/setting" element={<Setting />} />
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

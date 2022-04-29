/* eslint-disable react/jsx-no-undef */
import type { ReactElement } from 'react'
import React, {
  lazy,
  Suspense
} from 'react';
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
  Spin,
} from 'antd';
import 'antd/dist/antd.min.css'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';

// pages

const DashboardLayout = lazy(() => import('./layout/dashboard'));
const Index = lazy(() => import('./pages/index'));
const Setting = lazy(() => import('./pages/setting'));
const Control = lazy(() => import('./pages/control'));
const Login = lazy(() => import('./pages/login'));

const App: React.FC = (props: any): ReactElement => {
  const Loading = (): ReactElement => <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} size="large" />
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <Suspense>
            <DashboardLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<Loading />}>
              <Index />
            </Suspense>
          } />
          <Route path="/control" element={
            <Suspense fallback={<Loading />}>
              <Control />
            </Suspense>
          } />
          <Route path="/setting" element={
            <Suspense fallback={<Loading />}>
              <Setting />
            </Suspense>
          } />
        </Route>
        <Route path='login' element={
          <Suspense>
            <Login />
          </Suspense>
        } />
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

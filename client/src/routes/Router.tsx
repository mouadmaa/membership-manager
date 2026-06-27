// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import RootRedirect from './RootRedirect';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const AdminDashboard = Loadable(lazy(() => import('../views/admin/AdminDashboard')));
const AdminPlans = Loadable(lazy(() => import('../views/admin/AdminPlans')));
const AdminMembers = Loadable(lazy(() => import('../views/admin/AdminMembers')));
const AdminPayments = Loadable(lazy(() => import('../views/admin/AdminPayments')));
const AdminCheckins = Loadable(lazy(() => import('../views/admin/AdminCheckins')));

const MemberDashboard = Loadable(lazy(() => import('../views/member/MemberDashboard')));
const MemberCheckin = Loadable(lazy(() => import('../views/member/MemberCheckin')));

const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const Router = [
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'plans', element: <AdminPlans /> },
      { path: 'members', element: <AdminMembers /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'checkins', element: <AdminCheckins /> },
      { path: '*', element: <Navigate to="/admin/dashboard" /> },
    ],
  },
  {
    path: '/member',
    element: (
      <ProtectedRoute role="member">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <MemberDashboard /> },
      { path: 'checkin', element: <MemberCheckin /> },
      { path: '*', element: <Navigate to="/member/dashboard" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;

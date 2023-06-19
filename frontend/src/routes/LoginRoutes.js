import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/authentication/authentication3/Login3')));
const AuthRegister = Loadable(lazy(() => import('views/authentication/authentication3/Register3')));
const AuthRegisterVerification = Loadable(lazy(() => import('views/authentication/authentication3/VerifyMail3')));
const ResetPassword = Loadable(lazy(() => import('views/authentication/authentication3/ResetPassword3')));
const AuthForgotPassword = Loadable(lazy(() => import('views/authentication/authentication3/ForgotPassword3')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: (
    <NavMotion>
      <GuestGuard>
        <MinimalLayout />
      </GuestGuard>
    </NavMotion>
  ),
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/accounts/sign_in/log_in',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/auth/forgot-password',
      element: <AuthForgotPassword />
    },
    {
      path: '/auth/forgot-password/:id/:token',
      element: <ResetPassword />
    },
    {
      path: '/auth/verify/:id/:token',
      element: <AuthRegisterVerification />
    }
  ]
};

export default LoginRoutes;

import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import GuestRoute from './GuestRoute';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

const LoginRoutes = {
  path: '/',
  element: <GuestRoute />,
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    // {
    //   path: 'login',
    //   element: <LoginPage />
    // },
    {
      path: 'register',
      element: <RegisterPage />
    }
  ]
};

export default LoginRoutes;

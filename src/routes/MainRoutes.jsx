import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute'; // ✅ ADD THIS
import Transactions from '../pages/dashboard/transactions';
import ViewProfile from '../pages/profile/viewProfile';
import APISettingsManager from '../pages/profile/developer';
import Ledger from '../pages/dashboard/ledger';
import VirtualAccountLogs from '../pages/dashboard/report/VirtualAccountLogs';
import VirtualAccounts from '../pages/dashboard/report/VirtualAccounts';
import DeveloperSettings from '../pages/profile/developer';
import Merchants from '../pages/merchant/merchants';
import ApiManager from '../pages/api manager/apiManager';
import Service from '../pages/api manager/service';
import Order from '../pages/dashboard/report/order';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />, // 🔥 PROTECTION START
  children: [
    {
      element: <DashboardLayout />, // layout yahan shift
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'transaction',
          element: <Transactions />
        },
         {
          path: 'merchant',
          element: <Merchants allowedRoles={['admin']}/>
        },
        {
          path: 'virtual_accounts',
          element: <VirtualAccounts />
        },
        {
          path: 'ledger',
          element: <Ledger allowedRoles={['user']}/>
        },
        {
          path: 'vanlog',
          element: <VirtualAccountLogs />
        },
        {
          path: 'support',
          element: <SamplePage />
        },
        {
          path: 'setting',
          element: <DeveloperSettings allowedRoles={['user']}/>
        },
         {
          path: 'viewProfile',
          element: <ViewProfile />
        },
         {
          path: 'developer',
          element: <APISettingsManager />
        },
        {
          path: 'apimanager',
          element: <ApiManager allowedRoles={['admin']} />
        },
        {
          path: 'service',
          element: <Service allowedRoles={['admin']}/>
        },
        {
          path: 'order',
          element: <Order allowedRoles={['admin']}/>
        }
      ]
    }
  ]
};

export default MainRoutes;

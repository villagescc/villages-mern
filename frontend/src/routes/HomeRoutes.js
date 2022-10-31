import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// listing routing
const Posting = Loadable(lazy(() => import('views/listing/posting')));
const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));

// ==============================|| MAIN ROUTING ||============================== //

const HomeRoutes = {
    path: '/',
    element: (
      <MainLayout />
    ),
    children: [
        {
            path: '/home',
            element: <DashboardDefault />
        },
        {
            path: '/home/posting',
            element: <Posting />
        },
        {
            path: '/home/people',
            element: <DashboardAnalytics />
        }
    ]
};

export default HomeRoutes;

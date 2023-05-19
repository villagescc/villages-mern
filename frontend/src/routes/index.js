import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { BASE_PATH } from 'config';
// controller
import Loadable from 'ui-component/Loadable';
import HomeRoutes from './HomeRoutes';
import LoginRoutes from './LoginRoutes';
import PersonalRoute from './PersonalRoutes';
import AdminRoute from './AdminRoutes';
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';

const LandingPage = Loadable(lazy(() => import('views/pages/landing')));

// 404 Page Not Found
const PageNotFound = Loadable(lazy(() => import('views/pages/maintenance/Error')))



// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    // Login State 
    const { isLoggedIn } = useAuth()
    return useRoutes([{ path: '/', element: <LandingPage /> }, { path: '*', element: <PageNotFound path={isLoggedIn ? DASHBOARD_PATH : BASE_PATH} /> }, LoginRoutes, HomeRoutes, PersonalRoute, AdminRoute]);
}

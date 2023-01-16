import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// controller
import Loadable from 'ui-component/Loadable';
import HomeRoutes from './HomeRoutes';
import LoginRoutes from './LoginRoutes';
import PersonalRoute from './PersonalRoutes';
import AdminRoute from './AdminRoutes';

const LandingPage = Loadable(lazy(() => import('views/pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([{ path: '/', element: <LandingPage /> }, LoginRoutes, HomeRoutes, PersonalRoute, AdminRoute]);
}

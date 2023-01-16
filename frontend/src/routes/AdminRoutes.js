import { lazy } from 'react';

// project imports
import AdminGuard from 'utils/route-guard/AdminGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// login routing
const UsersAdmin = Loadable(lazy(() => import('views/admin/users/users')));

// ==============================|| AUTH ROUTING ||============================== //

const AdminRoutes = {
    path: '/admin/',
    element: (
        <AuthGuard>
            <AdminGuard>
                <MainLayout />
            </AdminGuard>
        </AuthGuard>
    ),
    children: [
        {
            path: 'users',
            element: <UsersAdmin />
        }
    ]
};

export default AdminRoutes;

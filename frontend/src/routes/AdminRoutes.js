import { lazy } from 'react';

// project imports
import AdminGuard from 'utils/route-guard/AdminGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// login routing
const UsersAdmin = Loadable(lazy(() => import('views/admin/users')));
const AdminAnalytics = Loadable(lazy(() => import('views/admin/analytics')));
const TransactionHistory = Loadable(lazy(() => import('views/admin/transaction-history')));
const TrustHistory = Loadable(lazy(() => import('views/admin/trust-history')));
const UserAdmin = Loadable(lazy(() => import('views/admin/user')));
const Developer = Loadable(lazy(() => import('views/admin/developer')));

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
        },
        {
            path: 'analytics',
            element: <AdminAnalytics />
        },
        {
            path: 'transaction-history',
            element: <TransactionHistory />
        },
        {
            path: 'trust-history',
            element: <TrustHistory />
        },
        {
            path: 'user/:userId',
            element: <UserAdmin />
        },
        {
            path: 'developer',
            element: <Developer />
        }
    ]
};

export default AdminRoutes;

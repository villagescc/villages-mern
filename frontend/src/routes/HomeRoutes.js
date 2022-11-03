import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// listing routing
const Posting = Loadable(lazy(() => import('views/listing/posting')));
const People = Loadable(lazy(() => import('views/listing/people')));
const Person = Loadable(lazy(() => import('views/listing/people/person')));

// map routing
const Map = Loadable(lazy(() => import('views/map')))

// ripple routing
const Trust = Loadable(lazy(() => import('views/ripple/trust')))
const Pay = Loadable(lazy(() => import('views/ripple/pay')))

// personal routing
const Notification = Loadable(lazy(() => import('views/user/notification')))
const ProfileView = Loadable(lazy(() => import('views/user/profile/view')))
const ProfileEdit = Loadable(lazy(() => import('views/user/profile/edit')))
const Setting = Loadable(lazy(() => import('views/user/setting')))

// documentation routing
const Help = Loadable(lazy(() => import('views/documentation/help')))
const Motivation = Loadable(lazy(() => import('views/documentation/motivation')))
const Privacy = Loadable(lazy(() => import('views/documentation/privacy')))


// ==============================|| MAIN ROUTING ||============================== //

const HomeRoutes = {
    path: '/',
    element: (
      <AuthGuard>
          <MainLayout />
      </AuthGuard>
    ),
    children: [
        {
            path: '/home',
            element: <DashboardDefault />
        },
        {
            path: '/listing/posts',
            element: <Posting />
        },
        {
            path: '/listing/people',
            element: <People />
        },
        {
            path: '/listing/person/:username',
            element: <Person />
        },
        {
            path: '/map',
            element: <Map />
        },
        {
            path: '/ripple/trust',
            element: <Trust />
        },
        {
            path: '/ripple/pay',
            element: <Pay />
        },
        {
            path: '/personal/notification',
            element: <Notification />
        },
        {
            path: '/personal/profile/view',
            element: <ProfileView />
        },
        {
            path: '/personal/profile/edit',
            element: <ProfileEdit />
        },
        {
            path: '/personal/setting',
            element: <Setting />
        },
        {
            path: '/documentation/help',
            element: <Help />
        },
        {
            path: '/documentation/motivation',
            element: <Motivation />
        },
        {
            path: '/documentation/privacy',
            element: <Privacy />
        },
    ]
};

export default HomeRoutes;

import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// listing routing
const Posting = Loadable(lazy(() => import('views/listing/posting')));
const PostingDetail = Loadable(lazy(() => import('views/listing/posting/PostingDetail')));

const People = Loadable(lazy(() => import('views/listing/people')));
const Person = Loadable(lazy(() => import('views/listing/people/person')));

// map routing
const Map = Loadable(lazy(() => import('views/map')));

// documentation routing
const Help = Loadable(lazy(() => import('views/documentation/help')));
const Motivation = Loadable(lazy(() => import('views/documentation/motivation')));
const Privacy = Loadable(lazy(() => import('views/documentation/privacy')));

// ==============================|| MAIN ROUTING ||============================== //

const HomeRoutes = {
    path: '/',
    element: <MainLayout />,
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
            path: '/listing/post/:id',
            element: <PostingDetail />
        },
        {
            path: '/listing/people',
            element: <People />
        },
        {
            path: '/listing/person/:id',
            element: <Person />
        },
        {
            path: '/map',
            element: <Map />
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
        }
    ]
};

export default HomeRoutes;

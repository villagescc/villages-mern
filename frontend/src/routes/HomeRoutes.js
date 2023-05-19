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
      element: <Posting />
    },
    {
      path: '/listing/posts',
      element: <Posting />
    },
    {
      path: '/listing/posts/page/:pageId',
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
      path: '/listing/person/:id/:username',
      element: <Person />
    },
    {
      path: '/listing/person/:id',
      element: <Person />
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

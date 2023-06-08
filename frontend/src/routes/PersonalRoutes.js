import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// ripple routing
const Trust = Loadable(lazy(() => import('views/ripple/trust')));
const Pay = Loadable(lazy(() => import('views/ripple/pay')));

// personal routing
const Notification = Loadable(lazy(() => import('views/user/notification')));
const Message = Loadable(lazy(() => import('views/user/chat')));
const ProfileView = Loadable(lazy(() => import('views/user/profile')));
const ProfileEdit = Loadable(lazy(() => import('views/user/profile/edit')));
const Setting = Loadable(lazy(() => import('views/user/setting')));

// map routing
const Map = Loadable(lazy(() => import('views/map')));
// ==============================|| PERSONAL ROUTING ||============================== //

const PersonalRoute = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/trust/:userId',
      element: <Trust />
    },
    {
      path: '/trust',
      element: <Trust />
    },
    {
      path: '/trust/:userId/:username',
      element: <Trust />
    },
    {
      path: '/pay/:userId',
      element: <Pay />
    },
    {
      path: '/pay/:userId/:username',
      element: <Pay />
    },
    {
      path: '/pay',
      element: <Pay />
    },
    {
      path: '/personal/notification',
      element: <Notification />
    },
    {
      path: '/personal/message',
      element: <Message />
    },
    {
      path: '/personal/message/:userId',
      element: <Message />
    },
    {
      path: '/personal/message/:userId/:username',
      element: <Message />
    },
    {
      path: '/personal/profile',
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
      path: '/map',
      element: <Map />
    }
  ]
};

export default PersonalRoute;

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
  IconUsers,
  IconDeviceAnalytics
};

// ==============================|| ADMIN MENU ITEMS ||============================== //

const admin = {
  id: 'admin',
  title: <FormattedMessage id="admin" />,
  type: 'group',
  children: [
    {
      id: 'users',
      title: <FormattedMessage id="users" />,
      type: 'item',
      url: '/admin/users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'analytics',
      title: <FormattedMessage id="analytics" />,
      type: 'item',
      url: '/admin/analytics',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    }
  ]
};

export default admin;

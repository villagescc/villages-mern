// third-party
import { FormattedMessage } from 'react-intl';
import HistoryIcon from '@mui/icons-material/History';
// assets
import { IconUsers, IconDeviceAnalytics, IconWallet, IconHeart } from '@tabler/icons';

// constant
const icons = {
  IconUsers,
  IconDeviceAnalytics,
  HistoryIcon,
  IconWallet,
  IconHeart
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
    },
    {
      id: 'trust-history',
      title: <FormattedMessage id="Trust History" />,
      type: 'item',
      url: '/admin/trust-history',
      icon: icons.IconHeart,
      breadcrumbs: false
    },
    {
      id: 'transaction-history',
      title: <FormattedMessage id="Transaction History" />,
      type: 'item',
      url: '/admin/transaction-history',
      icon: icons.IconWallet,
      breadcrumbs: false
    }
  ]
};

export default admin;

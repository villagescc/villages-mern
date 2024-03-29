// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconHeart, IconWallet } from '@tabler/icons';

// constant
const icons = {
  IconHeart,
  IconWallet
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ripple = {
  id: 'ripple',
  title: <FormattedMessage id="payments" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'pay',
      title: <FormattedMessage id="payment" />,
      type: 'item',
      url: '/pay',
      icon: icons.IconWallet,
      breadcrumbs: false
    },
    {
      id: 'trust',
      title: <FormattedMessage id="trust" />,
      type: 'item',
      url: '/trust',
      icon: icons.IconHeart,
      breadcrumbs: false
    }
  ]
};

export default ripple;

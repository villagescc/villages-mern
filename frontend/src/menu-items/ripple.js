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
  title: <FormattedMessage id="Payments" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'pay',
      title: <FormattedMessage id="payment" />,
      type: 'item',
      url: '/ripple/pay',
      icon: icons.IconWallet,
      breadcrumbs: false
    },
    {
      id: 'trust',
      title: <FormattedMessage id="trust" />,
      type: 'item',
      url: '/ripple/trust',
      icon: icons.IconHeart,
      breadcrumbs: false
    }
  ]
};

export default ripple;

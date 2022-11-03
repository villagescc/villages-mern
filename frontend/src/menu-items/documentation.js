// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconHelp, IconPoint, IconLock } from '@tabler/icons';

// constant
const icons = {
  IconHelp,
  IconPoint,
  IconLock
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const documentation = {
  id: 'documentation',
  title: <FormattedMessage id="documentation" />,
  type: 'group',
  children: [
    {
      id: 'trust',
      title: <FormattedMessage id="how" />,
      type: 'item',
      url: '/documentation/notification',
      icon: icons.IconHelp,
      breadcrumbs: false
    },
    {
      id: 'profile',
      title: <FormattedMessage id="motivation" />,
      type: 'item',
      url: '/documentation/motivation',
      icon: icons.IconPoint,
      breadcrumbs: false
    },
    {
      id: 'setting',
      title: <FormattedMessage id="privacy" />,
      type: 'item',
      url: '/documentation/privacy',
      icon: icons.IconLock,
      breadcrumbs: false
    }
  ]
};

export default documentation;

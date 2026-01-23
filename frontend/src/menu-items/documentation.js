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
      id: 'how',
      title: <FormattedMessage id="how" />,
      type: 'item',
      url: '/documentation/help',
      icon: icons.IconHelp,
      breadcrumbs: false
    },
    {
      id: 'motivation',
      title: <FormattedMessage id="motivation" />,
      type: 'item',
      url: '/documentation/motivation',
      icon: icons.IconPoint,
      breadcrumbs: false
    },
    {
      id: 'privacy',
      title: <FormattedMessage id="privacy" />,
      type: 'item',
      url: '/documentation/privacy',
      icon: icons.IconLock,
      breadcrumbs: false
    }
  ]
};

export default documentation;

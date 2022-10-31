// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics, IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconDeviceAnalytics,
    IconUsers
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const listing = {
    id: 'listing',
    title: <FormattedMessage id="listing" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'posting',
            title: <FormattedMessage id="posting" />,
            type: 'item',
            url: '/home/posting',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'people',
            title: <FormattedMessage id="people" />,
            type: 'item',
            url: '/home/people',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ]
};

export default listing;

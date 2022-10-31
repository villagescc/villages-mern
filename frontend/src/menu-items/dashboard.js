// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconDeviceAnalytics
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'home',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="analytics" />,
            type: 'item',
            url: '/home',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        }
    ]
};

export default dashboard;

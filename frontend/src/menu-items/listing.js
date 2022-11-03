// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconLayout, IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconLayout,
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
            url: '/listing/posts',
            icon: icons.IconLayout,
            breadcrumbs: false
        },
        {
            id: 'people',
            title: <FormattedMessage id="people" />,
            type: 'item',
            url: '/listing/people',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ]
};

export default listing;

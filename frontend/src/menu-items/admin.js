// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = {
    IconUsers
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
        }
    ]
};

export default admin;

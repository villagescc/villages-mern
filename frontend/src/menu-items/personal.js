// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconNotification, IconUser, IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconNotification,
    IconUser,
    IconSettings
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const personal = {
    id: 'personal',
    title: <FormattedMessage id="personal" />,
    type: 'group',
    children: [
        {
            id: 'trust',
            title: <FormattedMessage id="notification" />,
            type: 'item',
            url: '/personal/notification',
            icon: icons.IconNotification,
            breadcrumbs: false
        },
        {
            id: 'profile',
            title: <FormattedMessage id="profile" />,
            type: 'item',
            url: '/personal/profile/view',
            icon: icons.IconUser,
            breadcrumbs: false
        },
        {
            id: 'setting',
            title: <FormattedMessage id="setting" />,
            type: 'item',
            url: '/personal/setting',
            icon: icons.IconSettings,
            breadcrumbs: false
        }
    ]
};

export default personal;

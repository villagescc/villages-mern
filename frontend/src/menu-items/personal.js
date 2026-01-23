// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBell, IconUser, IconSettings, IconMessage } from '@tabler/icons';

// constant
const icons = {
    IconBell,
    IconUser,
    IconSettings,
    IconMessage
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const personal = {
    id: 'personal',
    title: <FormattedMessage id="personal" />,
    type: 'group',
    children: [
        {
            id: 'notification',
            title: <FormattedMessage id="notification" />,
            type: 'item',
            url: '/personal/notification',
            icon: icons.IconBell,
            breadcrumbs: false
        },
        {
            id: 'message',
            title: <FormattedMessage id="message" />,
            type: 'item',
            url: '/personal/message',
            icon: icons.IconMessage,
            breadcrumbs: false
        },
        {
            id: 'profile',
            title: <FormattedMessage id="profile" />,
            type: 'item',
            url: '/personal/profile',
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

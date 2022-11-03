// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconHeart, IconCurrencyDollar } from '@tabler/icons';

// constant
const icons = {
    IconHeart,
    IconCurrencyDollar
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const ripple = {
    id: 'ripple',
    title: <FormattedMessage id="trustline" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'trust',
            title: <FormattedMessage id="trust" />,
            type: 'item',
            url: '/ripple/trust',
            icon: icons.IconHeart,
            breadcrumbs: false
        },
        {
            id: 'pay',
            title: <FormattedMessage id="pay" />,
            type: 'item',
            url: '/ripple/pay',
            icon: icons.IconCurrencyDollar,
            breadcrumbs: false
        }
    ]
};

export default ripple;

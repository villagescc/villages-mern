// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconMap } from '@tabler/icons';

const map = {
    id: '',
    title: <FormattedMessage id="map" />,
    icon: IconMap,
    type: 'group',
    children: [
        {
            id: 'map',
            title: <FormattedMessage id="map" />,
            type: 'item',
            url: '/map',
            icon: IconMap,
            breadcrumbs: false
        }
    ]
};

export default map;

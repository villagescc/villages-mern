const LAYOUT_CONST = {
    VERTICAL_LAYOUT: 'vertical',
    HORIZONTAL_LAYOUT: 'horizontal',
    DEFAULT_DRAWER: 'default',
    MINI_DRAWER: 'mini-drawer'
};

export const listing_type = [
    {
        value: '',
        label: 'All listings'
    },
    {
        value: '1',
        label: 'OFFER'
    },
    {
        value: '2',
        label: 'REQUEST'
    },
    {
        value: '3',
        label: 'TEACH'
    },
    {
        value: '4',
        label: 'LEARN'
    },
];

export const radius = [
    {
        value: '',
        label: 'Anywhere'
    },
    {
        value: 1000,
        label: 'Within 1km'
    },
    {
        value: 5000,
        label: 'Within 5km'
    },
    {
        value: 10000,
        label: 'Within 10km'
    },
    {
        value: 50000,
        label: 'Within 50km'
    },
];

export default LAYOUT_CONST;

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
    value: 'OFFER',
    label: 'OFFER'
  },
  {
    value: 'REQUEST',
    label: 'REQUEST'
  },
  {
    value: 'TEACH',
    label: 'TEACH'
  },
  {
    value: 'LEARN',
    label: 'LEARN'
  }
];

export const radius = [
  {
    value: '',
    label: 'Anywhere'
  },
  {
    value: 1000,
    label: 'Within 1mile'
  },
  {
    value: 5000,
    label: 'Within 5mile'
  },
  {
    value: 10000,
    label: 'Within 10mile'
  },
  {
    value: 50000,
    label: 'Within 50mile'
  }
];

export default LAYOUT_CONST;

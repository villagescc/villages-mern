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
    value: 0,
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
  },
  {
    value: 100000,
    label: 'Within 100mile'
  },
  {
    value: 150000,
    label: 'Within 150mile'
  },
  {
    value: 200000,
    label: 'Within 200mile'
  }
];

// export const language = [
//   {
//     value: 'ar',
//     label: 'العربية'
//   },
//   {
//     value: 'bn',
//     label: 'বাংলা'
//   },
//   {
//     value: 'ch',
//     label: '中文'
//   },
//   {
//     value: 'de',
//     label: 'German'
//   },
//   {
//     value: 'en',
//     label: 'English'
//   },
//   {
//     value: 'es',
//     label: 'Español'
//   },
//   {
//     value: 'ar',
//     label: 'العربية'
//   },
//   {
//     value: 'bn',
//     label: 'বাংলা'
//   },
//   {
//     value: 'ch',
//     label: '中文'
//   },
//   {
//     value: 'de',
//     label: 'German'
//   },
//   {
//     value: 'en',
//     label: 'English'
//   },
//   {
//     value: 'es',
//     label: 'Español'
//   },
//   {
//     value: 'fa',
//     label: 'پارسی'
//   },
//   {
//     value: 'fr',
//     label: '"Français"'
//   },
//   {
//     value: 'gr',
//     label: 'ελληνική'
//   },
//   {
//     value: 'gu',
//     label: "Avañe'ẽ"
//   },
//   {
//     value: 'hi',
//     label: 'हिंदुस्तानी'
//   },
//   {
//     value: 'it',
//     label: 'Italiano'
//   },
//   {
//     value: 'ko',
//     label: '한국어'
//   },
//   {
//     value: 'ms',
//     label: 'Melayu'
//   },
//   {
//     value: 'nl',
//     label: 'Nederlandse'
//   },
//   {
//     value: 'pt',
//     label: 'Português'
//   },
//   {
//     value: 'ro',
//     label: 'Română'
//   },
//   {
//     value: 'ru',
//     label: 'русский'
//   },
//   {
//     value: 'sq',
//     label: 'shqiptar'
//   },
//   {
//     value: 'sr',
//     label: 'Српско-хрватски'
//   },
//   {
//     value: 'sv',
//     label: 'Swedish'
//   },
//   {
//     value: 'sw',
//     label: 'Kiswahili'
//   },
//   {
//     value: 'ta',
//     label: 'தமிழ்'
//   },
//   {
//     value: 'tr',
//     label: 'Türk'
//   }
// ];

export const language = [
  {
    value: 'en',
    label: 'English (UK)'
  },
  {
    value: 'fr',
    label: 'Français (French)'
  },
  {
    value: 'ro',
    label: 'Română (Romanian)'
  },
  {
    value: 'zh',
    label: '中文 (Chinese)'
  }
];

export default LAYOUT_CONST;

import { FOOTER_LINK_ICONS } from 'pdap-design-system';
export const COURT_WARRANT_RECORD_TYPES = ['Court Cases', 'Wanted Persons'];
export const ALL_LOCATION_TYPES = ['locality', 'county', 'state', 'federal'];

import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export const NAV_LINKS = [
  {
    path: 'annotate',
    text: 'Annotate'
  },
  {
    path: '/',
    text: 'Data'
  },
  {
    path: '/about',
    text: 'About'
  },
  {
    path: '/donate',
    text: 'Donate'
  },
  {
    href: 'https://docs.pdap.io/',
    text: 'Docs'
  },
  {
    icon: faCircleUser,
    path: '/profile'
  }
];

export const FOOTER_LINKS = [
  {
    href: 'https://github.com/orgs/Police-Data-Accessibility-Project',
    text: 'GitHub',
    icon: FOOTER_LINK_ICONS.GITHUB
  },
  {
    href: 'https://discord.gg/wMqex8nKZJ',
    text: 'Discord',
    icon: FOOTER_LINK_ICONS.DISCORD
  },
  {
    href: 'https://newsletter.pdap.io/',
    text: 'Newsletter',
    icon: FOOTER_LINK_ICONS.NEWSLETTER
  },
  {
    href: 'https://docs.pdap.io/',
    text: 'Docs',
    icon: FOOTER_LINK_ICONS.DOCS
  },
  {
    href: 'https://docs.pdap.io/activities/publish-data',
    text: 'Publish data',
    icon: FOOTER_LINK_ICONS.PUBLISH
  },
  {
    href: 'mailto:contact@pdap.io',
    text: 'Email',
    icon: FOOTER_LINK_ICONS.EMAIL
  }
];

export const STATES_TO_ABBREVIATIONS = new Map([
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['American Samoa', 'AS'],
  ['Arizona', 'AZ'],
  ['Arkansas', 'AR'],
  ['Armed Forces Americas', 'AA'],
  ['Armed Forces Europe', 'AE'],
  ['Armed Forces Pacific', 'AP'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['District Of Columbia', 'DC'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Guam', 'GU'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Marshall Islands', 'MH'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Northern Mariana Islands', 'NP'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Puerto Rico', 'PR'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['US Virgin Islands', 'VI'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY']
]);

export const ABBREVIATIONS_TO_STATES = new Map([
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AS', 'American Samoa'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['AA', 'Armed Forces Americas'],
  ['AE', 'Armed Forces Europe'],
  ['AP', 'Armed Forces Pacific'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District Of Columbia'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['GU', 'Guam'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MH', 'Marshall Islands'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['NP', 'Northern Mariana Islands'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['PR', 'Puerto Rico'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['VI', 'US Virgin Islands'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming']
]);

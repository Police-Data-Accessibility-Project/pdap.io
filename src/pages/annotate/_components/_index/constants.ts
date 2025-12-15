import { urlTypes } from '@/pages/annotate/_components/_shared/types';

export const tabIDs = {
  URL_TYPE: 'url_type',
  LOCATION: 'location',
  AGENCY: 'agency',
  RECORD_TYPE: 'record_type',
  NAME: 'name',
  CONFIRM: 'confirm'
};
export type TabID = (typeof tabIDs)[keyof typeof tabIDs];

export const tabs = [
  { name: 'URL Type', id: tabIDs.URL_TYPE },
  { name: 'Location', id: tabIDs.LOCATION },
  { name: 'Agency', id: tabIDs.AGENCY },
  { name: 'Record Type', id: tabIDs.RECORD_TYPE },
  { name: 'Name', id: tabIDs.NAME },
  { name: 'Confirm', id: tabIDs.CONFIRM }
];

// Each URL Type has a distinct path of allowable tabs it can access
export const validTabsByUrlType = {
  [urlTypes.DATA_SOURCE]: [
    tabIDs.URL_TYPE,
    tabIDs.LOCATION,
    tabIDs.AGENCY,
    tabIDs.RECORD_TYPE,
    tabIDs.NAME,
    tabIDs.CONFIRM
  ],

  [urlTypes.META_URL]: [
    tabIDs.URL_TYPE,
    tabIDs.LOCATION,
    tabIDs.AGENCY,
    tabIDs.NAME,
    tabIDs.CONFIRM
  ],

  [urlTypes.INDIVIDUAL]: [
    tabIDs.URL_TYPE,
    tabIDs.LOCATION,
    tabIDs.AGENCY,
    tabIDs.RECORD_TYPE,
    tabIDs.NAME,
    tabIDs.CONFIRM
  ],

  [urlTypes.NOT_RELEVANT]: [tabIDs.URL_TYPE, tabIDs.CONFIRM],

  [urlTypes.BROKEN]: [tabIDs.URL_TYPE, tabIDs.CONFIRM],

  [urlTypes.NOT_SURE]: [
    tabIDs.URL_TYPE,
    tabIDs.LOCATION,
    tabIDs.AGENCY,
    tabIDs.RECORD_TYPE,
    tabIDs.NAME,
    tabIDs.CONFIRM
  ]
};

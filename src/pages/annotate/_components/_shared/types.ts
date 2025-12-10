import { RECORD_TYPES_BY_CATEGORY } from '@/pages/annotate/_components/_shared/constants';

//======================
// Annotation GET Types
//======================
export type NextAnonymousAnnotationType = {
  url_info: URLInfoType;
  html_info: Record<string, number | string>; //Unused in logic
  batch_info: BatchInfoType;
  agency_suggestions: AgencyLocationSuggestionsType;
  location_suggestions: AgencyLocationSuggestionsType;
  url_type_suggestions: URLTypeSuggestion[];
  record_type_suggestions: RecordTypeSuggestionsType;
  name_suggestions: NameSuggestionsType;
  session_id: string;
}

export type URLTypeSuggestion = {
  url_type: urlTypeType;
  endorsement_count: number;
}

export type AgencyLocationSuggestionType = {
  id: number;
  display_name: string;
  user_count: number;
  robo_confidence: number | null;
}

export type AgencyLocationSuggestionsType = {
  suggestions: AgencyLocationSuggestionType[];
}

export type BatchInfoType = {
  count_annotated: number;
  total_urls: number;
  count_not_annotated: number;
}

export type URLInfoType = {
  url: string;
  url_id: number;
}

export type RecordTypeSuggestionType = {
  record_type: RecordType;
  user_count: number;
  robo_confidence: number;
}

export type RecordTypeSuggestionsType = {
  suggestions: RecordTypeSuggestionType[];
}

export type NameSuggestionType = {
  id: number;
  display_name: string;
  user_count: number;
  robo_count: number;
}

export type NameSuggestionsType = {
  suggestions: NameSuggestionType[];
}

//======================
// Miscellaneous Types
//======================

export type RadioOptionType = {
  value: string | number;
  label: string;
  display_name?: string | null;
};
export const urlTypes = {
  DATA_SOURCE: 'Relevant Data Source',
  META_URL: 'Agency Homepage or Info',
  INDIVIDUAL: 'Individual Record',
  NOT_RELEVANT: 'Not Relevant Or Useful',
  BROKEN: 'Broken / bad data',
  NOT_SURE: 'Not Sure'
};
export type urlTypeType = (typeof urlTypes)[keyof typeof urlTypes];

// Category names (keys of the object)
export type RecordCategory = keyof typeof RECORD_TYPES_BY_CATEGORY;

// All possible record types (inner string values)
export type RecordType =
  (typeof RECORD_TYPES_BY_CATEGORY)[RecordCategory][number];

//======================
// Variable Types
//======================

export type AgencyLocationSelectionType = {
  id: number;
  display_name: string;
}

export type NameSelectionType = {
  nameID: number | null;
  name: string;
  new: boolean;
}
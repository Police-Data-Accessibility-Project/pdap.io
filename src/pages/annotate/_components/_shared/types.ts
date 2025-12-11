import { RECORD_TYPES_BY_CATEGORY } from '@/pages/annotate/_components/_shared/constants';

//======================
// Annotation GET Types
//======================
export type NextAnonymousAnnotationResponseType = {
  next_annotation: NextAnonymousAnnotationType;
  session_id: string;
}

export type NextAnonymousAnnotationType = {
  url_info: URLInfoType;
  html_info: Record<string, number | string>; //Unused in logic
  batch_info: BatchInfoType;
  agency_suggestions: AgencyLocationSuggestionsType;
  location_suggestions: AgencyLocationSuggestionsType;
  url_type_suggestions: URLTypeSuggestion[];
  record_type_suggestions: RecordTypeSuggestionsType;
  name_suggestions: NameSuggestionsType;
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
export type urlTypeType = 'data source' | 'meta url' | 'not relevant' | 'individual record' | 'broken page'

// Category names (keys of the object)
export type RecordCategory = keyof typeof RECORD_TYPES_BY_CATEGORY;

// All possible record types (inner string values)
export type RecordType =
  (typeof RECORD_TYPES_BY_CATEGORY)[RecordCategory][number];

//======================
// Variable Types
//======================

export type URLTypeSelectionType = {
  value: urlTypeType | null;
  display_name: string | null;
}

export type AgencyLocationSelectionType = {
  id: number;
  display_name: string;
}

export type NameSelectionType = {
  nameID: number | null;
  name: string;
  new: boolean;
}

//======================
// Submission Types
//======================

export type AgencySubmissionType = {
  not_found: boolean;
  agency_ids: Array<number>;
}

export type LocationSubmissionType = {
  not_found: boolean;
  location_ids: Array<number>;
}

export type NameInfoSubmissionType = {
  new_name: string | null;
  existing_name_id: number | null;
}

export type AnnotationSubmissionType = {
  suggested_status: urlTypeType;
  record_type: RecordType | null;
  agency_info: AgencySubmissionType;
  location_info: LocationSubmissionType;
  name_info: NameInfoSubmissionType;
}
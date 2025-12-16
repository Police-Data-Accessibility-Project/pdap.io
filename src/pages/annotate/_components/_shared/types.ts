import { RECORD_TYPES_BY_CATEGORY } from '@/pages/annotate/_components/_shared/constants';

//======================
// Annotation GET Types
//======================

export type NextAnnotationResponse = {
  next_annotation: NextAnnotation;
  session_id: string | null;
}

export type NextAnnotation = {
  url_info: URLInfoType;
  html_info: Record<string, number | string>; //Unused in logic
  batch_info: BatchInfoType;
  agency_suggestions: AgencyLocationSuggestions;
  location_suggestions: AgencyLocationSuggestions;
  url_type_suggestions: URLTypeSuggestion[];
  record_type_suggestions: RecordTypeSuggestions;
  name_suggestions: NameSuggestions;
}

export type URLTypeSuggestion = {
  url_type: UrlType;
  endorsement_count: number;
}

export type AgencyLocationSuggestion = {
  id: number;
  display_name: string;
  user_count: number;
  robo_confidence: number | null;
}

export type AgencyLocationSuggestions = {
  suggestions: AgencyLocationSuggestion[];
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

export type RecordTypeSuggestions = {
  suggestions: RecordTypeSuggestionType[];
}

export type NameSuggestion = {
  id: number;
  display_name: string;
  user_count: number;
  robo_count: number;
}

export type NameSuggestions = {
  suggestions: NameSuggestion[];
}

//========================
// Contribution GET Types
//========================

export type UserContributionGetResponse = {
  count_validated: number;
  agreement: UserContributionAgreement;
}

export type UserContributionAgreement = {
  record_type: number;
  agency: number;
  url_type: number;
}

//======================
// Miscellaneous Types
//======================

export type RadioOption = {
  value: string | number;
  label: string;
  display_name?: string | null;
  anno_labels?: AnnoLabels | null;
};
export const urlTypes = {
  DATA_SOURCE: 'Relevant Data Source',
  META_URL: 'Agency Homepage or Info',
  INDIVIDUAL: 'Individual Record',
  NOT_RELEVANT: 'Not Relevant Or Useful',
  BROKEN: 'Broken / bad data',
  NOT_SURE: 'Not Sure'
};
export type UrlType = 'data source' | 'meta url' | 'not relevant' | 'individual record' | 'broken page'

// Category names (keys of the object)
export type RecordCategory = keyof typeof RECORD_TYPES_BY_CATEGORY;

// All possible record types (inner string values)
export type RecordType =
  (typeof RECORD_TYPES_BY_CATEGORY)[RecordCategory][number];

export type AnnoLabels = {
  user?: string | null;
  robo?: string | null;
}


//======================
// Variable Types
//======================

export type URLTypeSelection = {
  value: UrlType | null;
  display_name: string | null;
}

export type AgencyLocationSelection = {
  id: number;
  display_name: string;
}

export type NameSelection = {
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

export type AnnotationSubmission = {
  suggested_status: UrlType;
  record_type: RecordType | null;
  agency_info: AgencySubmissionType;
  location_info: LocationSubmissionType;
  name_info: NameInfoSubmissionType;
}
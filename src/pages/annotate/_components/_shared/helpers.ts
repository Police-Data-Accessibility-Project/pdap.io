import {
  AgencyLocationSuggestionType,
  AnnoLabels
} from '@/pages/annotate/_components/_shared/types';

interface EndorsementSource {
  user_count?: number | null;
  robo_confidence?: number | null;
}

export function getEndorsementLabels(
  suggestion: EndorsementSource
): AnnoLabels {
  return {
    user: suggestion.user_count ? suggestion.user_count.toString() : null,
    robo: suggestion.robo_confidence ? suggestion.robo_confidence + '%' : null
  };
}

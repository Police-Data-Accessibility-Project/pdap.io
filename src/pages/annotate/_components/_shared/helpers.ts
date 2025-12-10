import { AgencyLocationSuggestionType } from '@/pages/annotate/_components/_shared/types';

export function getEndorsementString(suggestion: AgencyLocationSuggestionType): string {
  let base: string = suggestion.display_name;
  if (suggestion.user_count) {
    base += ' 👥 ' + suggestion.user_count;
  }
  if (suggestion.robo_confidence) {
    base += ' 🤖 ' + suggestion.robo_confidence + "%";
  }
  return base;
}
export function getEndorsementString(suggestion) {
  let base = suggestion.display_name;
  if (suggestion.user_count) {
    base += ' 👥 ' + suggestion.user_count;
  }
  if (suggestion.robo_confidence) {
    base += ' 🤖 ' + suggestion.robo_confidence + "%";
  }
  return base;
}
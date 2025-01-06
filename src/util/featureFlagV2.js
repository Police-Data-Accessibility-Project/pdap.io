/**
 * Gets enabled / disabled status for features.
 *
 * @param {'ENHANCED_SEARCH' | 'AUTHENTICATE' | 'CREATE_RECORDS'} featureName Name of V2 feature to check
 * @returns {boolean} Whether the feature is enabled or not
 */
export function getIsV2FeatureEnabled(featureName) {
	console.debug('V2 feature flag:', {
		feature:
			featureName + ': ' + import.meta.env[`VITE_V2_FEATURE_${featureName}`],
	});
	return import.meta.env[`VITE_V2_FEATURE_${featureName}`] === 'enabled';
}

export function normalizeParamsForSearch(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) {
      return acc;
    }

    if (Array.isArray(value)) {
      if (!value.length) {
        return acc;
      }
      acc[key] = value.join(',');
      return acc;
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        return acc;
      }
      acc[key] = value;
      return acc;
    }

    acc[key] = String(value);
    return acc;
  }, {});
}

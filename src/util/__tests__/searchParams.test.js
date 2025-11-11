import { describe, expect, it } from 'vitest';
import { normalizeParamsForSearch } from '../searchParams';

describe('normalizeParamsForSearch', () => {
  it('drops empty values and formats arrays', () => {
    const params = {
      location_id: 'alpha-123',
      record_categories: ['Arrests', 'Court Cases'],
      record_types: [],
      include: undefined,
      note: null,
      empty: '    ',
      page_size: 0
    };

    expect(normalizeParamsForSearch(params)).toEqual({
      location_id: 'alpha-123',
      record_categories: 'Arrests,Court Cases',
      page_size: '0'
    });
  });

  it('returns an empty object when called without params', () => {
    expect(normalizeParamsForSearch()).toEqual({});
  });
});

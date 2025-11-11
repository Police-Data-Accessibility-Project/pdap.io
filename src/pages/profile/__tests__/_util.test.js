import { describe, expect, it } from 'vitest';
import { makeRawParams } from '../_util';

describe('makeRawParams', () => {
  it('omits record_categories when only All is provided', () => {
    const params = makeRawParams({
      location_id: 'loc-1',
      record_types: ['Court Cases'],
      record_categories: ['All']
    });

    expect(params).toEqual({
      location_id: 'loc-1',
      record_types: ['Court Cases'],
      record_categories: undefined
    });
  });

  it('filters All entries while keeping a cloned array', () => {
    const recordCategories = ['Arrests', 'All', 'Court Cases'];

    const params = makeRawParams({
      location_id: 'loc-2',
      record_types: ['Arrests'],
      record_categories: recordCategories
    });

    expect(params.record_categories).toEqual(['Arrests', 'Court Cases']);
    expect(params.record_categories).not.toBe(recordCategories);
    expect(recordCategories).toEqual(['Arrests', 'All', 'Court Cases']);
  });

  it('handles missing record_categories', () => {
    expect(
      makeRawParams({
        location_id: 'loc-3',
        record_types: ['Wanted Persons']
      })
    ).toEqual({
      location_id: 'loc-3',
      record_types: ['Wanted Persons'],
      record_categories: undefined
    });
  });
});

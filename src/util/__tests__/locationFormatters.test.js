import { getFullLocationText } from '../locationFormatters';

describe('getFullLocationText', () => {
  it('returns locality text when type is missing', () => {
    const location = {
      locality_name: 'Pittsburgh',
      county_name: 'Allegheny',
      state_iso: 'PA'
    };

    expect(getFullLocationText(location)).toBe('Pittsburgh, Allegheny, PA');
  });

  it('returns county text when type is missing', () => {
    const location = {
      county_name: 'Allegheny',
      state_iso: 'PA'
    };

    expect(getFullLocationText(location)).toBe('Allegheny County, PA');
  });

  it('returns state text when type is missing', () => {
    const location = {
      state_name: 'Pennsylvania',
      state_iso: 'PA'
    };

    expect(getFullLocationText(location)).toBe('Pennsylvania');
  });

  it('uses location_type when type is missing', () => {
    const location = {
      location_type: 'state',
      name: 'Indiana'
    };

    expect(getFullLocationText(location)).toBe('Indiana');
  });

  it('returns state text when only iso is provided', () => {
    const location = {
      state_iso: 'IN'
    };

    expect(getFullLocationText(location)).toBe('IN');
  });

  it('uses display_name fallback when available', () => {
    expect(getFullLocationText({ display_name: 'Indiana, USA' })).toBe(
      'Indiana, USA'
    );
  });

  it('falls back to United States when no location data is provided', () => {
    expect(getFullLocationText({})).toBe('United States');
  });
});

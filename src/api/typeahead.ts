import axios from 'axios';

const TYPEAHEAD_BASE = `${import.meta.env.VITE_API_URL}/typeahead`;

export type TypeaheadLocationSuggestion = {
  location_id: number;
  display_name: string;
  type: string;
};

export type TypeaheadAgencySuggestion = {
  display_name: string;
  id: number;
};

type TypeaheadType = 'locations' | 'agencies';

type TypeaheadResultMap = {
  locations: TypeaheadLocationSuggestion;
  agencies: TypeaheadAgencySuggestion;
};

/**
 * Returns a function that can be used to handle typeahead requests.
 */
const makeTypeaheadHandler =
  <T extends TypeaheadType>(type: T) =>
  async (val: string): Promise<TypeaheadResultMap[T][] | undefined> => {
    try {
      const response = await axios.get(`${TYPEAHEAD_BASE}/${type}`, {
        headers: {
          Authorization: import.meta.env.VITE_API_KEY
        },
        params: {
          query: val
        }
      });

      return response.data.suggestions;
    } catch (err) {
      console.error(err);
    }
  };

export const getTypeaheadLocations = makeTypeaheadHandler('locations');
export const getTypeaheadAgencies = makeTypeaheadHandler('agencies');

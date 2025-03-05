import axios from 'axios';

const TYPEAHEAD_BASE = `${import.meta.env.VITE_API_URL}/typeahead`;

/**
 * Returns a function that can be used to handle typeahead requests.
 *
 * @param {locations|agencies} type Record to search. Locations or agencies
 */
const makeTypeaheadHandler = (type) => async (val) => {
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

export function injectDerivedAgencyInfo(result) {
  const data = result.data?.data;
  if (!data) return result;

  const unique_jurisdictions = [];
  const unique_agency_type = [];

  data.agencies.forEach((agency) => {
    if (!unique_jurisdictions.includes(agency.jurisdiction_type)) {
      unique_jurisdictions.push(agency.jurisdiction_type);
    }

    if (!unique_agency_type.includes(agency.agency_type)) {
      unique_agency_type.push(agency.agency_type);
    }
  });

  // Modify the original structure to include new fields
  result.data.data.unique_jurisdictions = unique_jurisdictions;
  result.data.data.unique_agency_type = unique_agency_type;

  return result; // Return the full original structure
}

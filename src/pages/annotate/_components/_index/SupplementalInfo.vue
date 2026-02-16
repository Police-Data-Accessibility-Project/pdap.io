<template>
  <div>
    <div
      class="grid grid-cols-2 gap-4 border-2 border-solid border-goldneutral-200"
    >
      <div class="col-span-1 text-sm">
        <h3>Hints & Notes</h3>
        <h3 class="text-med">What makes a relevant Data Source?</h3>
        <p>
          Data can be found in unexpected places. The page may not say "data"
          anywhere on it. Check the list of Record Types below to see what we
          consider relevant.
        </p>
        <h3 class="text-med">What agencies are relevant?</h3>
        <p>
          We include courts and jails because they often contain information
          about police systems.
        </p>
        <h3 class="text-med">Individual Records</h3>
        <p>
          An incident report is an individual record; a list of incidents is a
          data source.
        </p>
      </div>
      <div class="col-span-1 text-sm">
        <h3>Record Types Reference</h3>
        <p>
          <a
            href="https://docs.pdap.io/activities/data-sources/data-dictionaries/record-types-taxonomy"
          >
            Read more about record types in the taxonomy
          </a>
        </p>

        <h3 class="text-med">Police &amp; Public Interactions</h3>
        <ul>
          <li>
            <strong>Accident Reports</strong>
            : Vehicle accident records, often for people to look up their
            reports.
          </li>
          <li>
            <strong>Arrest Records</strong>
            : Records of arrests within a jurisdiction.
          </li>
          <li>
            <strong>Calls for Service</strong>
            : Logs of officers responding to calls or initiating activity.
          </li>
          <li>
            <strong>Car GPS</strong>
            : Location data for police vehicles (rarely public).
          </li>
          <li>
            <strong>Citations</strong>
            : Low-level criminal offenses where citations were issued instead of
            arrests.
          </li>
          <li>
            <strong>Dispatch Logs</strong>
            : Logs of calls/orders made by dispatchers.
          </li>
          <li>
            <strong>Dispatch Recordings</strong>
            : Audio feeds or archives of dispatch channels.
          </li>
          <li>
            <strong>Field Contacts</strong>
            : Reports of police-civilian interactions, including force or
            routine contacts.
          </li>
          <li>
            <strong>Incident Reports</strong>
            : Reports written after responding to calls, criminal or not.
          </li>
          <li>
            <strong>Misc Police Activity</strong>
            : Police activities not covered by other categories.
          </li>
          <li>
            <strong>Officer Involved Shootings</strong>
            : Case files of shootings involving officers.
          </li>
          <li>
            <strong>Stops</strong>
            : Records of pedestrian or traffic stops.
          </li>
          <li>
            <strong>Surveys</strong>
            : Data collected from samples like inmates or judges.
          </li>
          <li>
            <strong>Use of Force Reports</strong>
            : Records of force used against civilians.
          </li>
          <li>
            <strong>Vehicle Pursuits</strong>
            : Records of police pursuits of fleeing vehicles.
          </li>
        </ul>

        <hr />

        <h3 class="text-med">Info About Officers</h3>
        <ul>
          <li>
            <strong>Complaints &amp; Misconduct</strong>
            : Records/statistics on misconduct investigations.
          </li>
          <li>
            <strong>Daily Activity Logs</strong>
            : Shift reports or timesheets created by officers.
          </li>
          <li>
            <strong>Training &amp; Hiring Info</strong>
            : Information about officer training or hiring.
          </li>
          <li>
            <strong>Personnel Records</strong>
            : Records on hiring, firing, discipline, or certification.
          </li>
        </ul>

        <hr />

        <h3 class="text-med">Info About Agencies</h3>
        <ul>
          <li>
            <strong>Annual &amp; Monthly Reports</strong>
            : Summary documents about police activities.
          </li>
          <li>
            <strong>Budgets &amp; Finances</strong>
            : Budgets, grants, and financial records.
          </li>
          <li>
            <strong>Geographic</strong>
            : Maps or data on jurisdiction zones/sectors.
          </li>
          <li>
            <strong>List of Data Sources</strong>
            : Collections of links to datasets or portals.
          </li>
          <li>
            <strong>Policies &amp; Contracts</strong>
            : Policies or procedural contracts.
          </li>
        </ul>

        <hr />

        <h3 class="text-med">Agency-Published Resources</h3>
        <ul>
          <li>
            <strong>Crime Maps &amp; Reports</strong>
            : Individual crimes shown in maps/tables.
          </li>
          <li>
            <strong>Crime Statistics</strong>
            : Summarized crime statistics for jurisdictions.
          </li>
          <li>
            <strong>Media Bulletins</strong>
            : Blotters, press releases, or alerts.
          </li>
          <li>
            <strong>Records Request Info</strong>
            : Forms, portals, or policies for records requests.
          </li>
          <li>
            <strong>Resources</strong>
            : Guidance on services, fees, or practices.
          </li>
          <li>
            <strong>Sex Offender Registry</strong>
            : Indexes of registered sex offenders.
          </li>
          <li>
            <strong>Wanted Persons</strong>
            : Lists of people with outstanding warrants.
          </li>
        </ul>

        <hr />

        <h3 class="text-med">Jails &amp; Courts Specific</h3>
        <ul>
          <li>
            <strong>Booking Reports</strong>
            : Records of booking/intake into jails.
          </li>
          <li>
            <strong>Court Cases</strong>
            : Dockets or other case-related records.
          </li>
          <li>
            <strong>Incarceration Records</strong>
            : Current inmate rosters, often with release notifications.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SupplementalInfo'
};
</script>

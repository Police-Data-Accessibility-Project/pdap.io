<template>
  <details class="suppl-panel">
    <summary class="suppl-toggle">
      <svg
        class="suppl-chevron"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
      <span>Hints, Notes &amp; Record Types Reference</span>
    </summary>

    <div class="suppl-content">
      <div class="suppl-grid">
        <!-- Left column: Hints -->
        <div class="suppl-section">
          <h3 class="suppl-heading">Hints &amp; Notes</h3>

          <div class="suppl-card">
            <h4 class="suppl-subheading">
              What makes a relevant Data Source?
            </h4>
            <p>
              Data can be found in unexpected places. The page may not say
              "data" anywhere on it. Check the list of Record Types to see what
              we consider relevant.
            </p>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">What agencies are relevant?</h4>
            <p>
              We include courts and jails because they often contain information
              about police systems.
            </p>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">Individual Records</h4>
            <p>
              An incident report is an individual record; a list of incidents is
              a data source.
            </p>
          </div>
        </div>

        <!-- Right column: Record Types -->
        <div class="suppl-section">
          <h3 class="suppl-heading">Record Types Reference</h3>
          <p class="suppl-link-text">
            <a
              href="https://docs.pdap.io/activities/data-sources/data-dictionaries/record-types-taxonomy"
              class="suppl-link"
            >
              Read more about record types in the taxonomy
            </a>
          </p>

          <div class="suppl-card">
            <h4 class="suppl-subheading">
              Police &amp; Public Interactions
            </h4>
            <ul class="suppl-list">
              <li>
                <strong>Accident Reports</strong> &mdash; Vehicle accident
                records
              </li>
              <li>
                <strong>Arrest Records</strong> &mdash; Records of arrests
                within a jurisdiction
              </li>
              <li>
                <strong>Calls for Service</strong> &mdash; Logs of officers
                responding to calls
              </li>
              <li>
                <strong>Car GPS</strong> &mdash; Location data for police
                vehicles
              </li>
              <li>
                <strong>Citations</strong> &mdash; Low-level criminal offenses
              </li>
              <li>
                <strong>Dispatch Logs</strong> &mdash; Logs of calls/orders by
                dispatchers
              </li>
              <li>
                <strong>Dispatch Recordings</strong> &mdash; Audio feeds of
                dispatch channels
              </li>
              <li>
                <strong>Field Contacts</strong> &mdash; Reports of
                police-civilian interactions
              </li>
              <li>
                <strong>Incident Reports</strong> &mdash; Reports after
                responding to calls
              </li>
              <li>
                <strong>Misc Police Activity</strong> &mdash; Uncategorized
                police activities
              </li>
              <li>
                <strong>Officer Involved Shootings</strong> &mdash; Case files
                of OIS
              </li>
              <li>
                <strong>Stops</strong> &mdash; Records of pedestrian or traffic
                stops
              </li>
              <li>
                <strong>Surveys</strong> &mdash; Data from samples like inmates
                or judges
              </li>
              <li>
                <strong>Use of Force Reports</strong> &mdash; Records of force
                used
              </li>
              <li>
                <strong>Vehicle Pursuits</strong> &mdash; Records of police
                pursuits
              </li>
            </ul>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">Info About Officers</h4>
            <ul class="suppl-list">
              <li>
                <strong>Complaints &amp; Misconduct</strong> &mdash; Misconduct
                investigations
              </li>
              <li>
                <strong>Daily Activity Logs</strong> &mdash; Shift reports or
                timesheets
              </li>
              <li>
                <strong>Training &amp; Hiring Info</strong> &mdash; Officer
                training/hiring
              </li>
              <li>
                <strong>Personnel Records</strong> &mdash; Hiring, firing,
                discipline, certification
              </li>
            </ul>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">Info About Agencies</h4>
            <ul class="suppl-list">
              <li>
                <strong>Annual &amp; Monthly Reports</strong> &mdash; Summary
                documents
              </li>
              <li>
                <strong>Budgets &amp; Finances</strong> &mdash; Budgets,
                grants, financial records
              </li>
              <li>
                <strong>Geographic</strong> &mdash; Maps or data on
                jurisdiction zones
              </li>
              <li>
                <strong>List of Data Sources</strong> &mdash; Collections of
                dataset links
              </li>
              <li>
                <strong>Policies &amp; Contracts</strong> &mdash; Policies or
                procedural contracts
              </li>
            </ul>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">Agency-Published Resources</h4>
            <ul class="suppl-list">
              <li>
                <strong>Crime Maps &amp; Reports</strong> &mdash; Individual
                crimes in maps/tables
              </li>
              <li>
                <strong>Crime Statistics</strong> &mdash; Summarized crime
                stats
              </li>
              <li>
                <strong>Media Bulletins</strong> &mdash; Blotters, press
                releases, alerts
              </li>
              <li>
                <strong>Records Request Info</strong> &mdash; Forms, portals, or
                policies
              </li>
              <li>
                <strong>Resources</strong> &mdash; Guidance on services, fees,
                or practices
              </li>
              <li>
                <strong>Sex Offender Registry</strong> &mdash; Indexes of
                registered offenders
              </li>
              <li>
                <strong>Wanted Persons</strong> &mdash; Lists of people with
                warrants
              </li>
            </ul>
          </div>

          <div class="suppl-card">
            <h4 class="suppl-subheading">Jails &amp; Courts Specific</h4>
            <ul class="suppl-list">
              <li>
                <strong>Booking Reports</strong> &mdash; Records of jail
                booking/intake
              </li>
              <li>
                <strong>Court Cases</strong> &mdash; Dockets or case-related
                records
              </li>
              <li>
                <strong>Incarceration Records</strong> &mdash; Current inmate
                rosters
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
// No logic needed — pure presentational component
</script>

<style scoped>
.suppl-panel {
  @apply mt-8 rounded-xl border-2 border-wineneutral-200 overflow-hidden;
}

.suppl-toggle {
  @apply flex items-center gap-2 px-5 py-4 cursor-pointer text-sm font-bold text-wineneutral-600 uppercase tracking-wider select-none hover:bg-wineneutral-50 transition-colors;
  list-style: none;
}

.suppl-toggle::-webkit-details-marker {
  display: none;
}

.suppl-chevron {
  @apply w-4 h-4 transition-transform duration-200 shrink-0;
}

.suppl-panel[open] .suppl-chevron {
  transform: rotate(90deg);
}

.suppl-content {
  @apply px-5 pb-5;
}

.suppl-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.suppl-section {
  @apply space-y-3;
}

.suppl-heading {
  @apply text-sm font-bold text-brand-wine-600 uppercase tracking-wider pb-2 border-b border-wineneutral-200;
}

.suppl-card {
  @apply bg-wineneutral-50 rounded-lg p-3 text-sm text-wineneutral-700 leading-relaxed;
}

.suppl-subheading {
  @apply text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1;
}

.suppl-link-text {
  @apply text-sm;
}

.suppl-link {
  @apply text-brand-wine-600 underline underline-offset-2 hover:text-brand-wine-800 transition-colors;
}

.suppl-list {
  @apply space-y-1 mt-1;
}

.suppl-list li {
  @apply text-xs leading-relaxed;
}
</style>

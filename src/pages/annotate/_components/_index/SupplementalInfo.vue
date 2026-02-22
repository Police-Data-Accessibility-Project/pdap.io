<template>
  <details class="mt-8 border-2 border-wineneutral-200 overflow-hidden group">
    <summary class="flex items-center gap-2 px-5 py-4 cursor-pointer text-sm font-bold text-wineneutral-800 uppercase tracking-wider select-none hover:bg-wineneutral-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
      <FontAwesomeIcon :icon="faChevronRight" class="w-4 h-4 transition-transform duration-200 shrink-0 group-open:rotate-90" />
      <span>Hints, Notes &amp; Record Types Reference</span>
    </summary>

    <div class="px-5 pb-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left column: Hints -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-brand-wine-600 uppercase tracking-wider pb-2 border-b border-wineneutral-200">Hints &amp; Notes</h3>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">
              What makes a relevant Data Source?
            </h4>
            <p>
              Data can be found in unexpected places. The page may not say
              "data" anywhere on it. Check the list of Record Types to see what
              we consider relevant.
            </p>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">What agencies are relevant?</h4>
            <p>
              We include courts and jails because they often contain information
              about police systems.
            </p>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">Individual Records</h4>
            <p>
              An incident report is an individual record; a list of incidents is
              a data source.
            </p>
          </div>
        </div>

        <!-- Right column: Record Types -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-brand-wine-600 uppercase tracking-wider pb-2 border-b border-wineneutral-200">Record Types Reference</h3>
          <p class="text-sm">
            <a
              href="https://docs.pdap.io/activities/data-sources/data-dictionaries/record-types-taxonomy"
              class="text-goldneutral-700 underline underline-offset-2 hover:text-goldneutral-800 transition-colors"
            >
              Read more about record types in the taxonomy
            </a>
          </p>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">
              Police &amp; Public Interactions
            </h4>
            <ul class="space-y-1 mt-1">
              <li class="text-xs leading-relaxed">
                <strong>Accident Reports</strong> &mdash; Vehicle accident
                records
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Arrest Records</strong> &mdash; Records of arrests
                within a jurisdiction
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Calls for Service</strong> &mdash; Logs of officers
                responding to calls
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Car GPS</strong> &mdash; Location data for police
                vehicles
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Citations</strong> &mdash; Low-level criminal offenses
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Dispatch Logs</strong> &mdash; Logs of calls/orders by
                dispatchers
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Dispatch Recordings</strong> &mdash; Audio feeds of
                dispatch channels
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Field Contacts</strong> &mdash; Reports of
                police-civilian interactions
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Incident Reports</strong> &mdash; Reports after
                responding to calls
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Misc Police Activity</strong> &mdash; Uncategorized
                police activities
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Officer Involved Shootings</strong> &mdash; Case files
                of OIS
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Stops</strong> &mdash; Records of pedestrian or traffic
                stops
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Surveys</strong> &mdash; Data from samples like inmates
                or judges
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Use of Force Reports</strong> &mdash; Records of force
                used
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Vehicle Pursuits</strong> &mdash; Records of police
                pursuits
              </li>
            </ul>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">Info About Officers</h4>
            <ul class="space-y-1 mt-1">
              <li class="text-xs leading-relaxed">
                <strong>Complaints &amp; Misconduct</strong> &mdash; Misconduct
                investigations
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Daily Activity Logs</strong> &mdash; Shift reports or
                timesheets
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Training &amp; Hiring Info</strong> &mdash; Officer
                training/hiring
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Personnel Records</strong> &mdash; Hiring, firing,
                discipline, certification
              </li>
            </ul>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">Info About Agencies</h4>
            <ul class="space-y-1 mt-1">
              <li class="text-xs leading-relaxed">
                <strong>Annual &amp; Monthly Reports</strong> &mdash; Summary
                documents
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Budgets &amp; Finances</strong> &mdash; Budgets,
                grants, financial records
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Geographic</strong> &mdash; Maps or data on
                jurisdiction zones
              </li>
              <li class="text-xs leading-relaxed">
                <strong>List of Data Sources</strong> &mdash; Collections of
                dataset links
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Policies &amp; Contracts</strong> &mdash; Policies or
                procedural contracts
              </li>
            </ul>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">Agency-Published Resources</h4>
            <ul class="space-y-1 mt-1">
              <li class="text-xs leading-relaxed">
                <strong>Crime Maps &amp; Reports</strong> &mdash; Individual
                crimes in maps/tables
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Crime Statistics</strong> &mdash; Summarized crime
                stats
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Media Bulletins</strong> &mdash; Blotters, press
                releases, alerts
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Records Request Info</strong> &mdash; Forms, portals, or
                policies
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Resources</strong> &mdash; Guidance on services, fees,
                or practices
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Sex Offender Registry</strong> &mdash; Indexes of
                registered offenders
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Wanted Persons</strong> &mdash; Lists of people with
                warrants
              </li>
            </ul>
          </div>

          <div class="bg-wineneutral-50 p-3 text-sm text-wineneutral-700 leading-relaxed">
            <h4 class="text-xs font-bold text-wineneutral-800 uppercase tracking-wider mb-1">Jails &amp; Courts Specific</h4>
            <ul class="space-y-1 mt-1">
              <li class="text-xs leading-relaxed">
                <strong>Booking Reports</strong> &mdash; Records of jail
                booking/intake
              </li>
              <li class="text-xs leading-relaxed">
                <strong>Court Cases</strong> &mdash; Dockets or case-related
                records
              </li>
              <li class="text-xs leading-relaxed">
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
</script>

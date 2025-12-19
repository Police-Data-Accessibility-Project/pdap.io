<template>
  <PortalTemplate
    portal-id="courtWarrant"
    title="Court and Warrant Data Sources"
    description="Explore public record sources related to court activity and wanted persons. This view focuses on jurisdictions with relevant records."
    :record-types="COURT_WARRANT_RECORD_TYPES"
    :map-sidebar-component="CourtWarrantMapSidebar"
    :map-options="mapOptions"
    results-heading="Filtered Data Sources"
    results-description="Results are grouped by geography and agency. Scroll or use the map to focus on a specific area."
    :follow-copy="followCopy"
  />
</template>

<script setup>
import PortalTemplate from '@/pages/portals/_components/PortalTemplate.vue';
import CourtWarrantMapSidebar from './_CourtWarrantMapSidebar.vue';
import { COURT_WARRANT_RECORD_TYPES } from '@/util/constants';

const mapOptions = {
  showLocalityMarkers: false,
  useDynamicBreakpoints: true,
  hideSidebarWithoutSelection: true
};

const followCopy = {
  buttonLabel: 'Follow this search',
  pendingLabel: 'Following…',
  signedOutPrompt: ' to follow this search.',
  followingMessage:
    "You're following this search. See your profile for updates.",
  successMessage: 'Following Court and Warrant data sources.',
  errorMessage: 'Error following this search. Please try again.'
};
</script>

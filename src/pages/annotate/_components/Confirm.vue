<script setup lang="ts">
import { PropType } from 'vue';
import {
  AgencyLocationSelectionType,
  NameSelectionType,
  RecordType,
  urlTypeType
} from '@/pages/annotate/_components/_shared/types';

const props = defineProps({
  urlType: {
    type: String as PropType<urlTypeType>,
    required: true
  },
  location: {
    type: Object as PropType<AgencyLocationSelectionType>,
    default: null
  },
  agency: {
    type: Object as PropType<AgencyLocationSelectionType>,
    default: null
  },
  recordType: {
    type: String as PropType<RecordType>,
    default: null
  },
  name: {
    type: Object as PropType<NameSelectionType>,
    default: null
  }
});
</script>

<template>
  <div>
    <p>
      <b>URL Type</b>
      : {{ props.urlType }}
    </p>
    <p>
      <b>Location</b>
      : {{ props.location?.display_name }}
    </p>
    <p>
      <b>Agency</b>
      : {{ props.agency?.display_name }}
    </p>
    <p>
      <b>RecordType</b>
      : {{ props.recordType }}
    </p>
    <p>
      <b>Name</b>
      : {{ props.name?.name }}
    </p>
  </div>
</template>

<style scoped></style>

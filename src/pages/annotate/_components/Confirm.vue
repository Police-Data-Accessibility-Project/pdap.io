<script setup>
const props = defineProps({
  urlType: {
    type: String,
    required: true
  },
  locationID: {
    type: Number,
    default: null
  },
  agencyID: {
    type: Number,
    default: null
  },
  recordType: {
    type: String,
    default: null
  },
  name: {
    type: String,
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
      : {{ props.locationID }}
    </p>
    <p>
      <b>Agency</b>
      : {{ props.agencyID }}
    </p>
    <p>
      <b>RecordType</b>
      : {{ props.recordType }}
    </p>
    <p>
      <b>Name</b>
      : {{ props.name }}
    </p>
  </div>
</template>

<style scoped></style>

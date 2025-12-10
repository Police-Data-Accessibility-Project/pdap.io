<script setup>
const props = defineProps({
  urlType: {
    type: String,
    required: true
  },
  location: {
    type: Number,
    default: null
  },
  agency: {
    type: Object,
    default: null
  },
  recordType: {
    type: String,
    default: null
  },
  name: {
    type: Object,
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

<template>
  <div class="help-text-icon">
    <a @click="toggleTooltip">
      <i class="fa fa-question-circle"></i>
    </a>
    <div class="tooltip" v-if="showTooltip">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTooltip: false,
    };
  },
  methods: {
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
      console.log("Tooltip visibility:", this.showTooltip);
    }
  }
};
</script>

<style scoped>
.help-text-icon {
  display: inline-block;
  position: relative;
}

.tooltip {
  position: absolute;
  top: 100%; /* Positions the tooltip below the icon */
  left: 0; /* Aligns the tooltip to the left edge of the icon */
  z-index: 100; /* Ensures the tooltip layers above other content */
  transform: translateY(10px); /* Adds a small space between the icon and tooltip */
  white-space: nowrap;
  padding:8px;
  border:1px solid black;
  font-size:20px;
  /* Additional styles for appearance, padding, colors, etc., can be added here */
}
</style>
// interactionUtils.js - Utilities for handling user interactions

import * as d3 from 'd3';

/**
 * Handles state click to zoom
 * @param {Object} params - Parameters needed for handling state click
 */
export function handleStateClick({
  event,
  d,
  path,
  width,
  height,
  props,
  activeLocationStack,
  layers,
  svg,
  updateDynamicLayers,
  STATUSES
}) {
  event.stopPropagation();

  const bounds = path.bounds(d);

  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;

  // Calculate appropriate zoom level
  const scale = 0.9 / Math.max(dx / width, dy / height);

  // Add state to the active location stack
  const stateName = d.properties.NAME;

  // Find the state in our data
  const state = props.states.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );

  if (state) {
    // Create a new state location object
    const stateLocation = {
      type: 'state',
      name: stateName,
      data: state
    };
    const newStack = [stateLocation];

    // Replace the entire stack with the new one
    activeLocationStack.splice(0, activeLocationStack.length, ...newStack);

    // Update overlay visibility
    layers.stateOverlay.status = STATUSES.IDLE;

    // Force update the overlay
    updateDynamicLayers();
  }

  // Get the stored zoom behavior
  const zoom = svg.__zoom__ || d3.zoom();
  // Calculate offset for sidebar
  const sidebarOffset = activeLocationStack.length > 0 ? 150 : 0;
  const translate = [
    width / 2 - scale * x - sidebarOffset,
    height / 2 - scale * y
  ];

  // Animate zoom transition
  svg
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );

  return activeLocationStack;
}

/**
 * Handles county click to zoom
 * @param {Object} params - Parameters needed for handling county click
 */
export function handleCountyClick({
  event,
  d,
  path,
  width,
  height,
  props,
  activeLocationStack,
  layers,
  svg,
  updateDynamicLayers,
  STATUSES
}) {
  event.stopPropagation();

  // Get county bounds
  const bounds = path.bounds(d);

  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;

  // Calculate appropriate zoom level - moderate zoom for counties
  const scale = 0.5 / Math.max(dx / width, dy / height);

  // Add county to the active location stack
  let fips;
  if (d.properties.STATE && d.properties.COUNTY) {
    fips = d.properties.STATE + d.properties.COUNTY;
  }

  const county = props.counties.find((c) => c.fips == fips);
  if (county) {
    // Create a new array to ensure reactivity
    const newStack = [...activeLocationStack];
    newStack.push({
      type: 'county',
      fips: fips,
      data: county
    });

    // Replace the entire stack with the new one
    activeLocationStack.splice(0, activeLocationStack.length, ...newStack);

    // Update overlay visibility
    layers.countyOverlay.status = STATUSES.IDLE;
    layers.stateOverlay.status = STATUSES.IDLE;

    // Force update the overlay
    updateDynamicLayers();
  }

  // Get the stored zoom behavior
  const zoom = svg.__zoom__ || d3.zoom();

  // Calculate offset for sidebar
  // Use a larger offset (150px) to make the shift more noticeable
  const sidebarOffset = activeLocationStack.length > 0 ? 150 : 0;
  const translate = [
    width / 2 - scale * x - sidebarOffset,
    height / 2 - scale * y
  ];

  // Animate zoom transition
  svg
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );

  return activeLocationStack;
}

/**
 * Handles locality marker click
 * @param {Object} params - Parameters needed for handling locality click
 */
export function handleLocalityClick({
  // event,
  locality,
  activeLocationStack,
  updateDynamicLayers
}) {
  // Add locality to the active location stack
  // Create a new array to ensure reactivity
  const newStack = [...activeLocationStack];
  newStack.push({
    type: 'locality',
    name: locality.name,
    data: locality,
    fips: locality.county_fips
  });

  // Replace the entire stack with the new one
  activeLocationStack.splice(0, activeLocationStack.length, ...newStack);

  updateDynamicLayers();

  return activeLocationStack;
}

/**
 * Resets zoom to default view
 * @param {Object} params - Parameters needed for resetting zoom
 */
export function resetZoom({ activeLocationStack, layers, svg, STATUSES }) {
  // Clear the active location stack
  activeLocationStack.splice(0, activeLocationStack.length);

  // Reset overlay visibility
  layers.stateOverlay.status = STATUSES.HIDDEN;
  layers.countyOverlay.status = STATUSES.HIDDEN;

  // Remove any existing overlays
  svg.select('.stateOverlay-layer').remove();
  svg.select('.countyOverlay-layer').remove();

  // Get the stored zoom behavior
  const zoom = svg.__zoom__ || d3.zoom();

  // Animate back to default view
  svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);

  return activeLocationStack;
}

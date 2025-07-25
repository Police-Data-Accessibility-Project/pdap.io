// zoomUtils.js - Utilities for handling zoom functionality

import * as d3 from 'd3';
import _debounce from 'lodash/debounce';

/**
 * Sets up zoom behavior for the map
 * @param {Object} params - Parameters needed for zoom setup
 */
export function setupZoom({
  svg,
  MIN_ZOOM,
  MAX_ZOOM,
  onZoom,
  onZoomStart,
  onZoomEnd
}) {
  // Create zoom behavior
  const zoom = d3
    .zoom()
    .scaleExtent([MIN_ZOOM, MAX_ZOOM]) // Min/max zoom levels
    .on('start', onZoomStart)
    .on('zoom', onZoom)
    .on('end', onZoomEnd);

  // Apply zoom to SVG
  svg.call(zoom);

  // Store the zoom behavior for later use
  svg.__zoom__ = zoom;

  // Initialize with no zoom
  svg.call(zoom.transform, d3.zoomIdentity);
}

/**
 * Adds zoom controls to the map
 * @param {Object} params - Parameters needed for adding zoom controls
 */
export function addZoomControls({ svg, resetZoom }) {
  // Add zoom in/out buttons
  const controls = svg
    .append('g')
    .attr('class', 'zoom-controls')
    .attr('transform', `translate(20, 20)`);

  // Create zoom in button group
  const zoomInGroup = controls.append('g').attr('class', 'zoom-in-control');

  // Zoom in button background
  zoomInGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 30)
    .attr('height', 30)
    .attr('rx', 3)
    .attr('cursor', 'pointer');

  // Zoom in button text
  zoomInGroup
    .append('text')
    .attr('x', 15)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text('+');

  // Add click handler to the group
  zoomInGroup.on('click', (event) => {
    event.stopPropagation();
    const zoom = svg.__zoom__ || d3.zoom();
    svg.transition().duration(300).call(zoom.scaleBy, 1.5);
  });

  // Create zoom out button group
  const zoomOutGroup = controls.append('g').attr('class', 'zoom-out-control');

  // Zoom out button background
  zoomOutGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', 35)
    .attr('width', 30)
    .attr('height', 30)
    .attr('rx', 3)
    .attr('cursor', 'pointer');

  // Zoom out button text
  zoomOutGroup
    .append('text')
    .attr('x', 15)
    .attr('y', 55)
    .attr('text-anchor', 'middle')
    .text('-');

  // Add click handler to the group
  zoomOutGroup
    .on('click', (event) => {
      event.stopPropagation();
      const zoom = svg.__zoom__ || d3.zoom();
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    })
    .on('dblclick', (event) => {
      event.stopPropagation();
    });

  // Create reset button group
  const resetGroup = controls.append('g').attr('class', 'reset-control');

  // Reset button background
  resetGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', 70)
    .attr('width', 30)
    .attr('height', 30)
    .attr('rx', 3)
    .attr('cursor', 'pointer');

  // Reset button text
  resetGroup
    .append('text')
    .attr('x', 15)
    .attr('y', 90)
    .attr('text-anchor', 'middle')
    .text('↺');

  // Add click handler to the group
  resetGroup.on('click', (event) => {
    event.stopPropagation();
    resetZoom();
  });
}

/**
 * Updates icon size based on zoom level
 */
export const updateIconSize = _debounce(
  (zoomLevel, MAX_ZOOM) => {
    // Calculate icon size: 2px at zoom 1, decreasing to .5px at zoom 22+
    const minSize = 0.5;
    const maxSize = 2;
    const maxZoomRange = MAX_ZOOM / 1.5;

    // Calculate size based on zoom level (inverse relationship)
    let iconSize;
    if (zoomLevel >= maxZoomRange) {
      iconSize = minSize;
    } else {
      // Linear interpolation between maxSize and minSize
      iconSize =
        maxSize - ((zoomLevel - 1) / (maxZoomRange - 1)) * (maxSize - minSize);
    }

    iconSize = Math.round(iconSize * 100) / 100;

    // Set the CSS variable on the container
    document.documentElement.style.setProperty('--icon-size', `${iconSize}px`);
  },
  100,
  { leading: true, trailing: true }
);

/**
 * Updates zoom level CSS variable
 */
export const updateZoomLevel = _debounce(
  (zoomLevel, MAX_ZOOM) => {
    const min = 0.3;
    const max = 1;

    // Calculate size based on zoom level (inverse relationship)
    let zoomInversion;
    if (zoomLevel >= MAX_ZOOM) {
      zoomInversion = min;
    } else {
      // Linear interpolation between maxSize and minSize
      zoomInversion = max - ((zoomLevel - 1) / (MAX_ZOOM - 1)) * (max - min);
    }

    // Round to 2 decimal places
    zoomInversion = Math.round(zoomInversion * 100) / 100;

    // Set the CSS variable on the container
    document.documentElement.style.setProperty(
      '--zoom-inversion',
      zoomInversion
    );
  },
  100,
  { leading: true, trailing: true }
);

/**
 * Handles overlay visibility based on zoom level
 */
export function handleOverlaysOnZoom({
  event,
  currentZoom,
  layers,
  activeLocationStack,
  props,
  svg,
  STATUSES
}) {
  if (event.transform.k < currentZoom) {
    const COUNTY_THRESHOLD = 5.25;
    const STATE_THRESHOLD = 1.25;

    if (
      layers.countyOverlay.status === STATUSES.IDLE &&
      event.transform.k < COUNTY_THRESHOLD
    ) {
      layers.countyOverlay.status = STATUSES.HIDDEN;

      const activeLocation =
        activeLocationStack[activeLocationStack.length - 1];
      if (
        activeLocation &&
        ['fips', 'county_fips'].some((s) => s in activeLocation)
      ) {
        const stateIndex = activeLocationStack.findLastIndex(
          (loc) => loc.type === 'state'
        );

        if (stateIndex >= 0) {
          activeLocationStack = activeLocationStack.slice(0, stateIndex + 1);
        } else {
          const inferredState = props.states.find(
            (state) => state.state_iso === activeLocation.data.state_iso
          );

          if (inferredState) {
            activeLocationStack = [
              {
                type: 'state',
                name: inferredState.name,
                data: inferredState
              }
            ];
          }
        }
      }

      // Remove county overlay from DOM
      svg.select('.countyOverlay-layer').remove();
    }

    // State overlay - when zooming out completely
    if (
      layers.stateOverlay.status === STATUSES.IDLE &&
      event.transform.k < STATE_THRESHOLD
    ) {
      layers.stateOverlay.status = STATUSES.HIDDEN;
      layers.countyOverlay.status = STATUSES.HIDDEN;

      // Remove overlay layers from DOM
      svg.select('.stateOverlay-layer').remove();
      svg.select('.countyOverlay-layer').remove();

      // Clear the active location stack since we're zooming out completely
      // But only if we're actually below the threshold
      if (event.transform.k < STATE_THRESHOLD) {
        activeLocationStack = [];
      }
    }
  }

  return activeLocationStack;
}

/**
 * Updates layer visibility based on zoom level
 */
export function updateLayerVisibility({
  layers,
  currentZoom,
  svg,
  createLegend,
  STATUSES
}) {
  // Track if visibility changed
  let visibilityChanged = false;

  // Show/hide layers based on zoom level
  Object.keys(layers).forEach((layerName) => {
    const layer = layers[layerName];

    const shouldBeVisible =
      currentZoom >= layer.minZoom && currentZoom <= layer.maxZoom;

    // Check if visibility changed
    if (Boolean(layer.status === STATUSES.IDLE) && shouldBeVisible) {
      visibilityChanged = true;
    }

    // Update visibility state
    layer.status = shouldBeVisible ? STATUSES.IDLE : STATUSES.HIDDEN;

    // Apply visibility to DOM
    const layerElement = svg.select(`.${layerName}-layer`);
    if (!layerElement.empty()) {
      layerElement.style('display', shouldBeVisible ? 'block' : 'none');
    }
  });

  // Update legend if layer visibility changed
  if (visibilityChanged) {
    // Remove existing legend
    svg.select('.legend').remove();
    // Create new legend with appropriate scale
    createLegend();
  }
}

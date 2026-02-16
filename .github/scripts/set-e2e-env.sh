#!/bin/bash

# Set E2E environment variables based on event type and inputs

if [[ "$GITHUB_EVENT_NAME" == "workflow_dispatch" ]]; then
  echo "E2E_TESTING_URL=$TEST_URL" >> $GITHUB_ENV
  
  # Use provided API URL if it exists, otherwise use conditional logic
  if [[ -n "$API_URL" ]]; then
    echo "VITE_API_URL=$API_URL" >> $GITHUB_ENV
  elif [[ "$TEST_URL" == *"pdap.io"* ]]; then
    echo "VITE_API_URL=https://data-sources.pdap.io/api/v2" >> $GITHUB_ENV
    echo "VITE_API_URL_V3=https://data-sources.pdap.io/api/v3" >> $GITHUB_ENV
    echo "VITE_SOURCE_COLLECTOR_API_URL=https://source-collector.pdap.io/api" >> $GITHUB_ENV
    echo "VITE_API_KEY=$E2E_API_KEY_PROD" >> $GITHUB_ENV
    echo "E2E_TESTING_ENV=production" >> $GITHUB_ENV
  else
    echo "VITE_API_URL=https://data-sources.pdap.dev/api/v2" >> $GITHUB_ENV
    echo "VITE_API_URL_V3=https://data-sources.pdap.dev/api/v3" >> $GITHUB_ENV
    echo "VITE_API_KEY=$E2E_API_KEY_DEV" >> $GITHUB_ENV
    echo "VITE_SOURCE_COLLECTOR_API_URL=https://source-collector-app-stage-eqjje.ondigitalocean.app/api" >> $GITHUB_ENV
  fi
else 
  # It's a PR. Run against prod if merging to main, dev otherwise
  if [[ $GITHUB_BASE_REF == "main" ]]; then
    echo "VITE_API_URL=https://data-sources.pdap.io/api/v2" >> $GITHUB_ENV
    echo "VITE_API_URL_V3=https://data-sources.pdap.io/api/v3" >> $GITHUB_ENV
    echo "VITE_SOURCE_COLLECTOR_API_URL=https://source-collector.pdap.io/api" >> $GITHUB_ENV
    echo "VITE_API_KEY=$E2E_API_KEY_PROD" >> $GITHUB_ENV
    echo "E2E_TESTING_ENV=production" >> $GITHUB_ENV
  else
    echo "VITE_API_URL=https://data-sources.pdap.dev/api/v2" >> $GITHUB_ENV
    echo "VITE_API_URL_V3=https://data-sources.pdap.dev/api/v3" >> $GITHUB_ENV
    echo "VITE_SOURCE_COLLECTOR_API_URL=https://source-collector-app-stage-eqjje.ondigitalocean.app/api" >> $GITHUB_ENV
    echo "VITE_API_KEY=$E2E_API_KEY_DEV" >> $GITHUB_ENV
  fi
fi

# Ensure v2 feature flags are enabled for E2E runs unless explicitly overridden
for flag in ENHANCED_SEARCH AUTHENTICATE CREATE_RECORDS SHOW_REQUESTS SIGNUP; do
  echo "VITE_V2_FEATURE_${flag}=enabled" >> $GITHUB_ENV
done

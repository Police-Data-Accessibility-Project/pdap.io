<template>
  <transition mode="out-in">
    <div
      v-if="submitPending"
      class="flex items-center justify-center min-h-[300px] w-full flex-col relative"
    >
      <Spinner
        :show="submitPending"
        :size="64"
        text="Submitting label..."
      />
    </div>
    <div v-else data-test="annotate-confirm">
      <h3 class="text-sm font-semibold text-wineneutral-800 uppercase tracking-wider mb-4">Review your label</h3>

      <div data-test="annotate-confirm-summary" class="border border-wineneutral-200 overflow-hidden">
        <div class="flex items-baseline justify-between px-4 py-3 border-b border-wineneutral-100">
          <span class="text-sm font-semibold text-wineneutral-800 shrink-0">URL Type</span>
          <span class="text-sm text-wineneutral-900 text-right">
            {{ props.urlType?.display_name || '—' }}
          </span>
        </div>
        <div class="flex items-baseline justify-between px-4 py-3 border-b border-wineneutral-100">
          <span class="text-sm font-semibold text-wineneutral-800 shrink-0">Location</span>
          <span class="text-sm text-wineneutral-900 text-right">
            {{ props.location?.display_name || '—' }}
          </span>
        </div>
        <div class="flex items-baseline justify-between px-4 py-3 border-b border-wineneutral-100">
          <span class="text-sm font-semibold text-wineneutral-800 shrink-0">Agency</span>
          <span class="text-sm text-wineneutral-900 text-right">
            {{ props.agency?.display_name || '—' }}
          </span>
        </div>
        <div class="flex items-baseline justify-between px-4 py-3 border-b border-wineneutral-100">
          <span class="text-sm font-semibold text-wineneutral-800 shrink-0">Record Type</span>
          <span class="text-sm text-wineneutral-900 text-right">
            {{ props.recordType || '—' }}
          </span>
        </div>
        <div class="flex items-baseline justify-between px-4 py-3">
          <span class="text-sm font-semibold text-wineneutral-800 shrink-0">Name</span>
          <span class="text-sm text-wineneutral-900 text-right">
            {{ props.name?.name || '—' }}
          </span>
        </div>
      </div>

      <button data-test="annotate-submit" @click="handleSubmit" class="pdap-button-primary mt-6 w-full">
        Submit Label
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
/**
 * Annotation Confirmation Component
 *
 * Users can review their annotations to ensure correct behavior before submitting.
 * Handles calls to network, sending request and retrieving new annotation.
 */
import { PropType } from 'vue';
import {
  AgencyLocationSelection,
  AnnotationSubmission,
  NameSelection,
  NextAnnotationResponse,
  RecordType,
  URLTypeSelection
} from '@/pages/annotate/_components/_shared/types';
import { postAnnotation } from '@/api/annotate';
import { Spinner } from 'pdap-design-system';
import { useMutation } from '@tanstack/vue-query';

//====================
//Props, Models, Emits
//====================
const props = defineProps({
  urlType: {
    type: Object as PropType<URLTypeSelection>,
    required: true
  },
  location: {
    type: Object as PropType<AgencyLocationSelection>,
    default: null
  },
  agency: {
    type: Object as PropType<AgencyLocationSelection>,
    default: null
  },
  recordType: {
    type: String as PropType<RecordType>,
    default: null
  },
  name: {
    type: Object as PropType<NameSelection>,
    default: null
  }
});

const annotationModel = defineModel<NextAnnotationResponse>({});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

//=================
// Query Mutation
//=================
const {
  mutateAsync: submitAnnotation,
  isPending: submitPending,
  error: submitError
} = useMutation({
  mutationFn: async (postData: AnnotationSubmission) => {
    const {
      next_annotation: {
        url_info: { url_id }
      }
    } = annotationModel.value;
    const session_id: string | null = annotationModel.value?.session_id;

    return await postAnnotation(postData, url_id, session_id);
  },
  onSuccess: (data) => {
    annotationModel.value = data;
  }
});

//=================
// Request Logic
//=================
async function handleSubmit() {
  // Compose post annotation
  const postData: AnnotationSubmission = {
    suggested_status: props.urlType.value,
    record_type: props.recordType,
    agency_info: {
      agency_ids: props.agency ? [props.agency.id] : [],
      not_found: false // TODO: Allow for declaring not found.
    },
    location_info: {
      location_ids: props.location ? [props.location.id] : [],
      not_found: false // TODO: Allow for declaring not found.
    },
    name_info: {
      new_name: (props.name?.new || props.name?.nameID === 'new') ? props.name?.name : null,
      existing_name_id: (props.name?.new || props.name?.nameID === 'new') ? null : props.name?.nameID
    }
  };

  await submitAnnotation(postData);
  emit('submit');
}
</script>

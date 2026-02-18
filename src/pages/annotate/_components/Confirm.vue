<template>
  <transition mode="out-in">
    <div
      v-if="submitPending"
      class="flex items-center justify-center min-h-[300px] w-full flex-col relative"
    >
      <Spinner
        :show="submitPending"
        :size="64"
        text="Submitting annotation..."
      />
    </div>
    <div v-else>
      <h3 class="confirm-heading">Review your annotation</h3>

      <div class="confirm-summary">
        <div class="confirm-row">
          <span class="confirm-label">URL Type</span>
          <span class="confirm-value">
            {{ props.urlType?.display_name || '—' }}
          </span>
        </div>
        <div class="confirm-row">
          <span class="confirm-label">Location</span>
          <span class="confirm-value">
            {{ props.location?.display_name || '—' }}
          </span>
        </div>
        <div class="confirm-row">
          <span class="confirm-label">Agency</span>
          <span class="confirm-value">
            {{ props.agency?.display_name || '—' }}
          </span>
        </div>
        <div class="confirm-row">
          <span class="confirm-label">Record Type</span>
          <span class="confirm-value">
            {{ props.recordType || '—' }}
          </span>
        </div>
        <div class="confirm-row confirm-row--last">
          <span class="confirm-label">Name</span>
          <span class="confirm-value">
            {{ props.name?.name || '—' }}
          </span>
        </div>
      </div>

      <button @click="handleSubmit" class="confirm-submit">
        Submit Annotation
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
      new_name: props.name?.new ? props.name?.name : null,
      existing_name_id: props.name?.new ? null : props.name?.nameID
    }
  };

  await submitAnnotation(postData);
  emit('submit');
}
</script>

<style scoped>
.confirm-heading {
  @apply text-sm font-semibold text-wineneutral-600 uppercase tracking-wider mb-4;
}

.confirm-summary {
  @apply rounded-lg border border-wineneutral-200 overflow-hidden;
}

.confirm-row {
  @apply flex items-baseline justify-between px-4 py-3 border-b border-wineneutral-100;
}

.confirm-row--last {
  @apply border-b-0;
}

.confirm-label {
  @apply text-sm font-semibold text-wineneutral-600 shrink-0;
}

.confirm-value {
  @apply text-sm text-wineneutral-900 text-right;
}

.confirm-submit {
  @apply mt-6 w-full py-3 rounded-lg bg-brand-gold-500 text-white font-bold text-sm
    transition-colors hover:bg-brand-gold-600 active:bg-brand-gold-700;
}
</style>

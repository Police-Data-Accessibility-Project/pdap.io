<template>
  <transition mode="out-in" :name="navIs">
    <div
      v-if="submitPending"
      class="flex items-center justify-center h-[80vh] w-full flex-col relative"
    >
      <!--TODO: Spinner does not currently display on submission. Unclear why.-->
      <Spinner
        :show="submitPending"
        :size="64"
        text="Submitting annotation..."
      />
    </div>
    <div
      v-else
      class="flex flex-col sm:flex-row sm:flex-wrap mt-6 sm:items-stretch sm:justify-between gap-4 h-full w-full relative [&>*]:w-full"
    >
      <p>
        <b>URL Type</b>
        : {{ props.urlType?.display_name }}
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
      <button @click="handleSubmit" class="pdap-button-primary">Submit</button>
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

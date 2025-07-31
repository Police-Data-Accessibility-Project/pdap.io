<template>
  <main
    class="pdap-flex-container"
    :class="{ 'mx-auto max-w-2xl': !isSuccess }">
    <h1 :data-test="TEST_IDS.reset_heading">
      Request a link to reset your password
    </h1>
    <template v-if="isSuccess">
      <p :data-test="TEST_IDS.success_subheading">
        We sent you an email with a link to reset your password. Please follow
        the link in the email to proceed
      </p>
    </template>

    <template v-else>
      <FormV2
        id="reset-password"
        ref="formRefRequest"
        data-test="reset-password-form"
        class="flex flex-col gap-2"
        name="reset-password"
        :error="error"
        :schema="VALIDATION_SCHEMA_REQUEST_PASSWORD"
        @submit="requestReset">
        <InputText
          id="email"
          autocomplete="email"
          :data-test="TEST_IDS.email_input"
          name="email"
          label="Email"
          placeholder="Your email address" />
        <Button
          class="max-w-full"
          :data-test="TEST_IDS.form_submit"
          :is-loading="isLoading"
          type="submit">
          Request password reset
        </Button>
      </FormV2>
    </template>
  </main>
</template>

<script setup>
import { Button, FormV2, InputText } from 'pdap-design-system';
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { requestPasswordReset } from '@/api/auth';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';
import { TEST_IDS } from '../../e2e/fixtures/test-ids';

// Constants
const VALIDATION_SCHEMA_REQUEST_PASSWORD = [
  {
    name: 'email',
    validators: {
      required: {
        value: true
      },
      email: {
        message: 'Please provide your email address',
        value: true
      }
    }
  }
];

// Stores
const user = useUserStore();

const {
  error,
  isSuccess,
  isLoading,
  mutate: requestReset
} = useMutation({
  mutationFn: async (formValues) => {
    const { email } = formValues;
    await requestPasswordReset(email);
  },
  onSuccess: () => {
    toast.success('Password reset request received');
  },
  onError: (err) => {
    toast.error(err.message ?? 'Something went wrong. Please try again.');
  }
});

// Reactive vars
const formRefRequest = ref();

// Lifecycle hooks
onMounted(() => {
  formRefRequest.value?.setValues({ email: user.email });
});
</script>

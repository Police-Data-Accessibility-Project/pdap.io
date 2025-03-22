<template>
  <main
    class="pdap-flex-container"
    :class="{ 'mx-auto max-w-2xl': !isSuccess }">
    <h1>Change your password</h1>
    <p v-if="!hasValidatedToken" class="flex flex-col items-start sm:gap-4">
      Loading...
    </p>
    <p
      v-else-if="hasValidatedToken && isExpiredToken"
      data-test="token-expired"
      class="flex flex-col items-start sm:gap-4">
      Sorry, that token has expired.
      <RouterLink
        data-test="re-request-link"
        to="/request-reset-password"
        @click="
          isExpiredToken = false;
          error = undefined;
          token = undefined;
        ">
        Click here to request another
      </RouterLink>
    </p>

    <FormV2
      v-else
      id="reset-password"
      data-test="reset-password-form"
      class="flex flex-col gap-2"
      name="reset-password"
      :error="error?.message ?? passwordMatchError"
      :schema="VALIDATION_SCHEMA_CHANGE_PASSWORD"
      @change="onChange"
      @submit="changePassword"
      @input="onResetInput">
      <InputPassword
        v-for="input of FORM_INPUTS_CHANGE_PASSWORD"
        v-bind="{ ...input }"
        :key="input.name" />

      <PasswordValidationChecker ref="passwordRef" />

      <Button
        class="max-w-full"
        :is-loading="isLoading || status === 'pending'"
        type="submit">
        Change password
      </Button>
    </FormV2>
  </main>
</template>

<script setup>
import { Button, FormV2, InputPassword } from 'pdap-design-system';
import PasswordValidationChecker from '@/components/PasswordValidationChecker.vue';
import { useUserStore } from '@/stores/user';
import parseJwt from '@/util/parseJwt';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { resetPassword, signInWithEmail } from '@/api/auth';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';

// Constants
const FORM_INPUTS_CHANGE_PASSWORD = [
  {
    autocomplete: 'password',
    'data-test': 'password',
    id: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Your updated password'
  },
  {
    autocomplete: 'password',
    'data-test': 'confirm-password',
    id: 'confirmPassword',
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm your updated password'
  }
];
const VALIDATION_SCHEMA_CHANGE_PASSWORD = [
  {
    name: 'password',
    label: 'Password',
    validators: {
      required: {
        value: true
      },
      password: {
        message: 'Please provide your password',
        value: true
      }
    }
  },
  {
    name: 'confirmPassword',
    validators: {
      required: {
        value: true
      },
      password: {
        message: 'Please confirm your password',
        value: true
      }
    }
  }
];

const route = useRoute();
const router = useRouter();
// const token = search.token;
const token = route.query.token;

// Stores
const user = useUserStore();

const {
  error,
  isSuccess,
  isLoading,
  status,
  mutate: changePassword
} = useMutation({
  mutationFn: async (formValues) => onSubmitChangePassword(formValues),
  onError: (err) => {
    if (err.message === 'The submitted token is invalid') {
      isExpiredToken.value = true;
    }
  },
  onSuccess: () => {
    toast.success('Password updated successfully');
  }
});

// Reactive vars
const passwordRef = ref();
const isExpiredToken = ref(false);
const hasValidatedToken = ref(false);
const passwordMatchError = ref(false);

// Effects
// Functions
// Lifecycle methods
onMounted(validateToken);

// Handlers
async function validateToken() {
  if (!token) {
    router.replace({ path: '/request-reset-password' });
    return;
  }

  const decoded = parseJwt(token);

  user.setEmail(decoded.sub.user_email);
  if (decoded.exp < Date.now() / 1000) {
    isExpiredToken.value = true;
  }

  hasValidatedToken.value = true;
}
// Handlers
/**
 * Handles clearing pw-match form errors on change if they exist
 */
function onChange(formValues) {
  passwordRef.value?.updatePasswordValidation(formValues.password);

  if (passwordMatchError.value) {
    handleValidatePasswordMatch(formValues);
  }
}

function onResetInput(e) {
  if (e.target.name === 'password') {
    passwordRef.value?.updatePasswordValidation(e.target.value);
  }
}

function handleValidatePasswordMatch(formValues) {
  if (formValues.password !== formValues.confirmPassword) {
    if (!passwordMatchError.value) {
      passwordMatchError.value = 'Passwords do not match, please try again.';
    }
    return false;
  } else {
    passwordMatchError.value = undefined;
    return true;
  }
}

async function onSubmitChangePassword(formValues) {
  const isPasswordValid = passwordRef.value?.isPasswordValid();

  if (!isPasswordValid) {
    passwordMatchError.value = 'Password is not valid';
  } else {
    if (passwordMatchError.value) passwordMatchError.value = undefined;
  }

  if (!handleValidatePasswordMatch(formValues) || !isPasswordValid) return;

  const { password } = formValues;
  await resetPassword(password, token);
  await signInWithEmail(parseJwt(token).sub.user_email, password);

  router.push({ path: 'profile' });
}
</script>

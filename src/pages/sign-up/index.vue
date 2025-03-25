<template>
  <main class="pdap-flex-container mx-auto max-w-2xl">
    <template v-if="!auth.userId && canAccessBeta">
      <h1>Sign Up</h1>

      <!-- TODO: when GH auth is complete, encapsulate duplicate UI from this and `/sign-up` -->
      <div
        v-if="githubAuthIsLoading"
        class="flex items-center justify-center h-full w-full">
        <Spinner :show="githubAuthIsLoading" text="Logging in" />
      </div>

      <template v-else>
        <template v-if="isGithubAuthError">
          <p class="error">
            There was an error logging you in with GitHub. Please try again
          </p>
        </template>
        <template v-else>
          <template v-if="githubAuthData?.userExists">
            <p class="error">
              You already have an account with this email address. Please
              <RouterLink to="/profile">sign in</RouterLink>
              and link your existing account to GitHub from your profile.
            </p>
          </template>

          <Button
            class="border-2 border-neutral-950 border-solid [&>svg]:ml-0"
            intent="tertiary"
            :disabled="githubAuthData?.userExists"
            @click="async () => await beginOAuthLogin('/sign-up')">
            <FontAwesomeIcon :icon="faGithub" />
            Sign up with GitHub
          </Button>
        </template>

        <h2>Or sign up with email</h2>
        <FormV2
          id="login"
          class="flex flex-col gap-2"
          data-test="login-form"
          name="login"
          :error="error"
          :schema="VALIDATION_SCHEMA"
          @change="onChange"
          @submit="completePasswordAuth"
          @input="onInput">
          <InputText
            id="email"
            autocomplete="email"
            data-test="email"
            name="email"
            label="Email"
            type="text"
            placeholder="Your email address" />

          <InputPassword
            v-for="input of PASSWORD_INPUTS"
            v-bind="{ ...input }"
            :key="input.name" />

          <PasswordValidationChecker ref="passwordRef" class="mt-2" />

          <Button
            class="max-w-full"
            :disabled="passwordAuthIsLoading"
            :is-loading="passwordAuthIsLoading"
            type="submit"
            data-test="submit-button">
            Create Account
          </Button>
        </FormV2>
        <div
          class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap w-full">
          <p class="w-full max-w-[unset]">Already have an account?</p>

          <RouterLink
            class="pdap-button-secondary flex-1 max-w-full"
            data-test="toggle-button"
            to="/sign-in">
            Sign in
          </RouterLink>
          <RouterLink
            class="pdap-button-secondary flex-1 max-w-full"
            data-test="reset-link"
            to="/request-reset-password">
            Reset Password
          </RouterLink>
        </div>
      </template>
    </template>
    <template v-else-if="!auth.userId && !canAccessBeta">
      <h1>We're in a controlled beta.</h1>
      <p>
        ...but we'd love to have you! If you'd like to create an account, email
        <a href="mailto:contact@pdap.io">contact@pdap.io</a>
        .
      </p>
      <div
        class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap w-full">
        <p class="w-full max-w-[unset]">Already have an account?</p>

        <RouterLink
          class="pdap-button-primary flex-1"
          data-test="toggle-button"
          to="/sign-in">
          Sign in
        </RouterLink>
      </div>
    </template>
    <RouterView v-else />
  </main>
</template>

<script setup>
// Imports
import {
  Button,
  FormV2,
  InputText,
  InputPassword,
  Spinner
} from 'pdap-design-system';
import PasswordValidationChecker from '@/components/PasswordValidationChecker.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ref, watch, onMounted } from 'vue';
import { useRoute, RouterView, useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';
import { signInWithGithub, signUpWithEmail, beginOAuthLogin } from '@/api/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
// Constants

// temporary beta access url param checker
const canAccessBeta = ref(false);
onMounted(() => {
  const route = useRoute();
  canAccessBeta.value = route.query.beta === 'true';
});
const PASSWORD_INPUTS = [
  {
    autocomplete: 'new-password',
    'data-test': 'password',
    id: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Your password'
  },
  {
    autocomplete: 'new-password',
    'data-test': 'confirm-password',
    id: 'confirmPassword',
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm your password'
  }
];
const VALIDATION_SCHEMA = [
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
  },
  {
    name: 'password',
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

const {
  isError: isGithubAuthError,
  data: githubAuthData,
  mutate: completeGithubAuth,
  isLoading: githubAuthIsLoading
} = useMutation({
  mutationFn: authGithub,
  // onError: (error) => {},
  onSuccess: (data) => {
    if (data?.userExists || !data) return;
    router.push({ path: '/sign-up/success' });
  }
});

const { mutate: completePasswordAuth, isLoading: passwordAuthIsLoading } =
  useMutation({
    mutationFn: (formValues) => authPassword(formValues),
    onError: (err) => {
      error.value = err.response.data.message;
    },
    onSuccess: () => {
      router.push({ path: '/sign-up/success' });
    }
  });

watch(
  () => route.query.gh_access_token,
  (newToken, oldToken) => {
    if (newToken && newToken !== oldToken) {
      completeGithubAuth();
    }
  },
  {
    immediate: true
  }
);

// Reactive vars
const passwordRef = ref();
const error = ref(undefined);

// Functions
// Handlers
/**
 * When signing up: handles clearing pw-match form errors on change if they exist
 */
function onChange(formValues) {
  passwordRef.value.updatePasswordValidation(formValues.password);

  if (error.value) {
    handleValidatePasswordMatch(formValues);
  }
}

function onInput(e) {
  if (e.target.name === 'password') {
    passwordRef.value.updatePasswordValidation(e.target.value);
  }
}

function handleValidatePasswordMatch(formValues) {
  if (formValues.password !== formValues.confirmPassword) {
    if (!error.value) {
      error.value = 'Passwords do not match, please try again.';
    }
    return false;
  } else {
    error.value = undefined;
    return true;
  }
}
async function authGithub() {
  if (auth.isAuthenticated())
    return router.push(auth.redirectTo ?? { path: '/profile' });

  try {
    const githubAccessToken = route.query.gh_access_token;

    if (githubAccessToken) {
      const tokens = await signInWithGithub(githubAccessToken);

      if (tokens) return router.push(auth.redirectTo ?? { path: '/profile' });
    }
    return null;
  } catch (error) {
    if (error.response.data.message.includes('already exists')) {
      auth.setRedirectTo({ path: '/profile' });
      return { userExists: true };
    } else throw error;
  }
}
async function authPassword(formValues) {
  const isPasswordValid = passwordRef.value.isPasswordValid();

  if (!isPasswordValid) {
    error.value = 'Password is not valid';
  } else {
    if (error.value) error.value = undefined;
  }

  if (!handleValidatePasswordMatch(formValues) || !isPasswordValid) return;

  const { email, password } = formValues;

  await signUpWithEmail(email, password);
}
</script>

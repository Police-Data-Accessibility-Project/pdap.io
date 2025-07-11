<template>
  <main class="pdap-flex-container mx-auto max-w-2xl pb-24">
    <h1>Sign In</h1>

    <!-- TODO: when GH auth is complete, encapsulate duplicate UI from this and `/sign-up` -->
    <div
      v-if="
        !(isGithubAuthError || githubAuthData?.userExists) &&
        (githubAuthIsLoading || route.query.gh_access_token)
      "
      class="flex items-center justify-center h-full w-full">
      <Spinner
        :show="
          !(isGithubAuthError || githubAuthData?.userExists) &&
          (githubAuthIsLoading || route.query.gh_access_token)
        "
        text="Logging in" />
    </div>

    <template v-else>
      <template v-if="isGithubAuthError">
        <p class="error" :data-test="TEST_IDS.error_message">
          There was an error logging you in with GitHub. Please try again
        </p>
      </template>
      <template v-else>
        <template v-if="githubAuthData?.userExists">
          <p class="error" :data-test="TEST_IDS.error_message">
            You already have an account with this email address. Please sign in
            and link your existing account to GitHub from your profile.
          </p>
        </template>

        <Button
          class="border-2 border-neutral-950 border-solid [&>svg]:ml-0"
          intent="tertiary"
          :data-test="TEST_IDS.github_signin_button"
          :disabled="githubAuthData?.userExists"
          @click="async () => await beginOAuthLogin()">
          <FontAwesomeIcon :icon="faGithub" />
          Sign in with GitHub
        </Button>
      </template>

      <h2>Or sign in with email</h2>
      <FormV2
        id="login"
        class="flex flex-col gap-2"
        data-test="login-form"
        name="login"
        :error="error"
        :schema="VALIDATION_SCHEMA"
        @submit="completePasswordAuth">
        <InputText
          id="email"
          autocomplete="email"
          :data-test="TEST_IDS.email_input"
          name="email"
          label="Email"
          type="text"
          placeholder="Your email address" />
        <InputPassword
          id="password"
          autocomplete="password"
          :data-test="TEST_IDS.password_input"
          name="password"
          label="Password"
          type="password"
          placeholder="Your password" />

        <Button
          class="max-w-full mt-4"
          :disabled="passwordAuthIsLoading"
          :is-loading="passwordAuthIsLoading"
          type="submit"
          :data-test="TEST_IDS.submit_button">
          Sign in
        </Button>
      </FormV2>
      <div
        class="flex flex-col items-start sm:flex-row sm:items-center sm:gap-4 w-full">
        <RouterLink
          class="pdap-button-secondary flex-1 max-w-full"
          intent="secondary"
          to="/sign-up">
          Create Account
        </RouterLink>
        <RouterLink
          class="pdap-button-secondary flex-1 max-w-full"
          to="/request-reset-password">
          Reset Password
        </RouterLink>
      </div>
    </template>
  </main>
</template>

<script setup>
// Imports
import { signInWithEmail } from '@/api/auth';
import {
  Button,
  FormV2,
  InputPassword,
  InputText,
  Spinner
} from 'pdap-design-system';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ref, watch } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { beginOAuthLogin, signInWithGithub } from '@/api/auth';
import { TEST_IDS } from '../../e2e/fixtures/test-ids';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

// Constants
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
    if (!data || data?.userExists) return;
    router.replace(auth.redirectTo ?? { path: '/profile' });
  }
});

const { mutate: completePasswordAuth, isLoading: passwordAuthIsLoading } =
  useMutation({
    mutationFn: (formValues) => authPassword(formValues),
    onError: () => {
      error.value =
        'Error logging in. Please ensure your password is correct and try again.';
    },
    onSuccess: () => {
      router.replace(auth.redirectTo ?? '/profile');
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
const error = ref(undefined);
// Handlers
async function authGithub() {
  if (auth.isAuthenticated()) {
    return router.push(auth.redirectTo ?? { path: '/profile' });
  }

  try {
    const githubAccessToken = route.query.gh_access_token;

    if (githubAccessToken) {
      const tokens = await signInWithGithub(githubAccessToken);

      if (tokens) {
        return router.push(auth.redirectTo ?? { path: '/profile' });
      }
    }
    return null;
  } catch (error) {
    if (error.response.data.message.includes('already exists')) {
      auth.setRedirectTo(auth.redirectTo ?? { path: '/profile' });
      return { userExists: true };
    } else throw error;
  }
}
/**
 * Logs user in
 */
async function authPassword(formValues) {
  const { email, password } = formValues;

  await signInWithEmail(email, password);
}
</script>

<style scoped>
.error {
  @apply border-red-800 dark:border-red-300 items-center justify-start flex bg-red-300 text-red-800 text-sm rounded-sm max-w-full p-2;
}
</style>

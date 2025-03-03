<template>
  <main class="pdap-flex-container mx-auto max-w-2xl pb-24">
    <h1>Sign In</h1>

    <!-- TODO: when GH auth is complete, encapsulate duplicate UI from this and `/sign-up` -->
    <div
      v-if="
        !isGithubAuthError &&
        (githubAuthIsLoading || route.query.gh_access_token)
      "
      class="flex items-center justify-center h-full w-full">
      <Spinner
        :show="
          !isGithubAuthError &&
          (githubAuthIsLoading || route.query.gh_access_token)
        "
        text="Logging in" />
    </div>

    <template v-else>
      <template v-if="isGithubAuthError">
        <p class="error">
          There was an error logging you in with Github. Please try again
        </p>
      </template>
      <template v-else>
        <template v-if="githubAuthData?.userExists">
          <p class="error">
            You already have an account with this email address. Please sign in
            and link your existing account to Github from your profile.
          </p>
        </template>

        <Button
          class="border-2 border-neutral-950 border-solid [&>svg]:ml-0"
          intent="tertiary"
          :disabled="githubAuthData?.userExists"
          @click="async () => await beginOAuthLogin()">
          <FontAwesomeIcon :icon="faGithub" />
          Sign in with Github
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
          data-test="email"
          name="email"
          label="Email"
          type="text"
          placeholder="Your email address" />
        <InputPassword
          id="password"
          autocomplete="password"
          data-test="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Your password" />

        <Button
          class="max-w-full mt-4"
          :disabled="passwordAuthIsLoading"
          :is-loading="passwordAuthIsLoading"
          type="submit"
          data-test="submit-button">
          Sign in
        </Button>
      </FormV2>
      <div
        class="flex flex-col items-start sm:flex-row sm:items-center sm:gap-4 w-full">
        <RouterLink
          class="pdap-button-secondary flex-1 max-w-full"
          intent="secondary"
          data-test="toggle-button"
          to="/sign-up">
          Create Account
        </RouterLink>
        <RouterLink
          class="pdap-button-secondary flex-1 max-w-full"
          data-test="reset-link"
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
import { ref, onMounted, watch } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { beginOAuthLogin, signInWithGithub } from '@/api/auth';

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
      // password: {
      // 	message: 'Please provide your password',
      // 	value: true,
      // },
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
    if (data?.userExists) return;
    router.replace(auth.redirectTo ?? { path: '/profile' });
  }
});

const { mutate: completePasswordAuth, isLoading: passwordAuthIsLoading } =
  useMutation({
    mutationFn: (formValues) => authPassword(formValues),
    // onError: (error) => {},
    onSuccess: () => {
      router.replace(auth.redirectTo ?? '/profile');
    }
  });

onMounted(() => completeGithubAuth());
watch(() => route.query, completeGithubAuth());

// Reactive vars
const error = ref(undefined);
// Handlers
async function authGithub() {
  if (auth.isAuthenticated())
    return router.push(auth.redirectTo ?? { path: '/profile' });

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
      auth.setRedirectTo({ path: '/profile' });
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

  error.value = undefined;
}
</script>

<style scoped>
.error {
  @apply border-red-800 dark:border-red-300 items-center justify-start flex bg-red-300 text-red-800 text-sm rounded-sm max-w-full p-2;
}
</style>

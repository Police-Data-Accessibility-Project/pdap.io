<route>
	{
		meta: {
			auth: true
		}
	}
</route>

<template>
  <main
    class="pdap-flex-container"
    :class="{ 'mx-auto max-w-2xl': !isSuccess }">
    <h1>Change your password</h1>
    <!-- TODO: make this copy conditional based on whether or not user signed up via GH -->
    <p>
      You signed up with a Github account linked to the email address you
      provided.
    </p>
    <p>
      Sign in with Github, or create a password to sign in with this email
      address.
    </p>
    <p>
      {{ error?.message ?? passwordMatchError }}
    </p>
    <!-- END TODO -->

    <Button
      class="border-2 border-neutral-950 border-solid [&>svg]:ml-0"
      intent="tertiary"
      @click="() => beginOAuthLogin('/profile')">
      <FontAwesomeIcon :icon="faGithub" />
      Sign in with Github
    </Button>

    <FormV2
      id="change-password"
      class="flex flex-col gap-2"
      data-test="change-password-form"
      name="change-password"
      :error="error?.message ?? passwordMatchError"
      :schema="VALIDATION_SCHEMA"
      @error="(output) => console.debug(output)"
      @change="onChange"
      @submit="updatePassword"
      @input="onInput">
      <InputPassword
        v-for="input of INPUTS"
        v-bind="{ ...input }"
        :key="input.name" />

      <PasswordValidationChecker ref="passwordRef" class="mt-2" />

      <Button
        class="max-w-full"
        :disabled="isLoading"
        :is-loading="isLoading"
        type="submit">
        Change password
      </Button>
    </FormV2>
  </main>
</template>

<script setup>
import { Button, FormV2, InputPassword } from 'pdap-design-system';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';
import PasswordValidationChecker from '@/components/PasswordValidationChecker.vue';
import { ref } from 'vue';
import { changePassword } from '@/api/user';
import { beginOAuthLogin } from '@/api/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

// Constants
const INPUTS = [
  {
    autocomplete: 'password',
    'data-test': 'password',
    id: 'current-password',
    name: 'currentPassword',
    label: 'Current password',
    type: 'password',
    placeholder: 'Your existing password'
  },
  {
    autocomplete: 'new-password',
    'data-test': 'password',
    id: 'password',
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Your updated password'
  },
  {
    autocomplete: 'new-password',
    'data-test': 'confirm-password',
    id: 'confirmPassword',
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your updated password'
  }
];
const VALIDATION_SCHEMA = [
  {
    name: 'currentPassword',
    validators: {
      required: {
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
  error,
  isSuccess,
  isLoading,
  mutate: updatePassword
} = useMutation({
  mutationFn: async (formValues) => onSubmit(formValues),
  onSuccess: () => {
    toast.success('Password updated successfully', {
      onClose: () => {
        router.push({ path: '/profile' });
      }
    });
  }
});

// Reactive vars
const passwordRef = ref();
const passwordMatchError = ref();

// Functions
// Handlers
/**
 * Handles clearing pw-match form errors on change if they exist
 */
function onChange(formValues) {
  passwordRef.value.updatePasswordValidation(formValues.password);

  if (passwordMatchError.value) {
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
    if (!passwordMatchError.value) {
      passwordMatchError.value = 'Passwords do not match, please try again.';
    }
    return false;
  } else {
    passwordMatchError.value = undefined;
    return true;
  }
}

async function onSubmit(formValues) {
  console.debug('submit', { formValues });
  const isPasswordValid = passwordRef.value.isPasswordValid();

  if (!isPasswordValid) {
    throw new Error('Password is not valid');
  }

  if (!handleValidatePasswordMatch(formValues) || !isPasswordValid) return;

  const { password, currentPassword } = formValues;
  await changePassword(currentPassword, password);
  return;
}
</script>

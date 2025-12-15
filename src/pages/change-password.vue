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
    :class="{ 'mx-auto max-w-2xl': !isSuccess }"
  >
    <h1>Change your password</h1>

    <!-- GH auth user - no password to change -->
    <template v-if="profileData?.external_accounts.github">
      <p>
        You signed up with a GitHub account linked to the email address you
        provided. No password is necessary to access your account.
      </p>
      <p>
        {{ error?.message ?? passwordMatchError }}
      </p>
    </template>

    <!-- Otherwise, allow change PW -->
    <template v-else>
      <FormV2
        id="change-password"
        class="flex flex-col gap-2"
        :data-test="TEST_IDS.change_password_form"
        name="change-password"
        :error="error?.message ?? passwordMatchError"
        :schema="VALIDATION_SCHEMA"
        @change="onChange"
        @submit="updatePassword"
        @input="onInput"
      >
        <InputPassword
          v-for="input of INPUTS"
          v-bind="{ ...input }"
          :key="input.name"
        />

        <PasswordValidationChecker ref="passwordRef" class="mt-2" />

        <Button
          class="max-w-full"
          :data-test="TEST_IDS.change_password_submit"
          :disabled="isLoading"
          :is-loading="isLoading"
          type="submit"
        >
          Change password
        </Button>
      </FormV2>
    </template>
  </main>
</template>

<script setup>
import { Button, FormV2, InputPassword } from 'pdap-design-system';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';
import PasswordValidationChecker from '@/components/PasswordValidationChecker.vue';
import { ref } from 'vue';
import { changePassword, getUser } from '@/api/user';
import { useRouter } from 'vue-router';
import { PROFILE } from '@/util/queryKeys';
import { TEST_IDS } from '../../e2e/fixtures/test-ids';

const router = useRouter();

// Constants
const INPUTS = [
  {
    autocomplete: 'password',
    'data-test': TEST_IDS.current_password_input,
    id: 'current-password',
    name: 'currentPassword',
    label: 'Current password',
    type: 'password',
    placeholder: 'Your existing password'
  },
  {
    autocomplete: 'new-password',
    'data-test': TEST_IDS.new_password_input,
    id: 'password',
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Your updated password'
  },
  {
    autocomplete: 'new-password',
    'data-test': TEST_IDS.confirm_password_input,
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
  data: profileData
  // error: profileError,
  // isLoading: profileLoading,
  // refetch: refetchProfile
} = useQuery({
  queryKey: [PROFILE],
  queryFn: async () => {
    const response = await getUser();
    return response.data.data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  onError: (err) => {
    console.error(err);
  }
});

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

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ChangePassword from '../change-password.vue';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn()
    }))
  };
});

vi.mock('@/api/user', () => ({
  changePassword: vi.fn()
}));

vi.mock('vue3-toastify', () => ({
  toast: { success: vi.fn() }
}));

function mountComponent() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return mount(ChangePassword, {
    global: {
      plugins: [createTestingPinia(), [VueQueryPlugin, { queryClient }]],
      stubs: {
        PasswordValidationChecker: {
          template: '<div data-test="password-checker-stub" />',
          methods: {
            updatePasswordValidation: vi.fn(),
            isPasswordValid: vi.fn(() => true)
          }
        }
      }
    }
  });
}

describe('ChangePassword', () => {
  it('renders the password change form unconditionally', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-test="change-password-form"]').exists()).toBe(
      true
    );
  });

  it('renders all three password inputs', () => {
    const wrapper = mountComponent();
    const inputs = wrapper.findAll('input[type="password"]');
    expect(inputs.length).toBe(3);
  });

  it('renders the submit button', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-test="change-password-submit"]').exists()).toBe(
      true
    );
  });
});

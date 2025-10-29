<route>
  {
    meta: {
      auth: true
    }
  }
</route>

<template>
  <main>
    <h1>Profile</h1>

    <ErrorBoundary>
      <div v-if="profileError">
        <p>There was an error fetching your profile.</p>
        <Button
          intent="primary"
          :data-test="TEST_IDS.profile_error_retry"
          @click="refetchProfile"
        >
          Try again
        </Button>
      </div>

      <template v-else>
        <h2 :data-test="TEST_IDS.profile_basic_info_heading">
          Basic information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            :class="{
              'profile-loading': !profileData && profileLoading
            }"
          >
            <h3 class="like-h4">Email</h3>
            <p :data-test="TEST_IDS.profile_email">
              {{ profileData?.email }}
            </p>
            <Button
              :data-test="TEST_IDS.profile_signout"
              @click="signOutWithRedirect"
            >
              Sign out
            </Button>
          </div>
          <div>
            <h3 class="like-h4">Password</h3>
            <router-link
              class="pdap-button-secondary"
              :to="'/change-password'"
              :data-test="TEST_IDS.profile_reset_password"
            >
              Reset your password
            </router-link>
          </div>

          <!-- GitHub info -->
          <section>
            <h3 class="like-h4">GitHub account</h3>
            <div
              :class="{
                'profile-loading': !profileData && profileLoading
              }"
            >
              <template
                v-if="didLinkGithub || profileData?.external_accounts.github"
              >
                <p :data-test="TEST_IDS.profile_github_linked">
                  <FontAwesomeIcon :icon="faGithub" />
                  Your account is linked with GitHub
                </p>
              </template>

              <template v-else>
                <Button
                  class="border-2 border-neutral-950 border-solid [&>svg]:ml-0"
                  :is-loading="githubAuthIsLoading"
                  :disabled="githubAuthIsLoading"
                  intent="tertiary"
                  :data-test="TEST_IDS.profile_github_link"
                  @click="async () => await beginOAuthLogin('/profile')"
                >
                  <FontAwesomeIcon :icon="faGithub" />
                  Link account with GitHub
                </Button>
              </template>
            </div>
          </section>

          <!-- API Key -->
          <section>
            <h3 class="like-h4">API Key</h3>

            <div
              :class="{
                'profile-loading h-12': !profileData && profileLoading
              }"
            >
              <Button
                :class="{ 'mb-5': apiKey }"
                intent="secondary"
                :is-loading="apiKeyIsLoading"
                :disabled="apiKeyIsLoading"
                type="button"
                :data-test="TEST_IDS.profile_api_key_regenerate"
                @click="recreateAPIKey"
              >
                Regenerate API Key
              </Button>
            </div>

            <transition name="dropdown" appear>
              <div v-if="apiKey" :data-test="TEST_IDS.profile_api_key_display">
                <ProfileAPIKey
                  :api-key="apiKey"
                  :on-dismiss="
                    () => {
                      resetAPIKeyData();
                    }
                  "
                />
              </div>
            </transition>
          </section>

          <!-- Permissions -->
          <section v-if="profileData?.permissions.length">
            <h3 class="like-h4">Permissions</h3>
            <ul :data-test="TEST_IDS.profile_permissions">
              <li
                v-for="permission of profileData.permissions"
                :key="permission"
              >
                {{ permission }}
              </li>
            </ul>
          </section>
        </div>

        <h2 :data-test="TEST_IDS.profile_my_stuff_heading">My stuff</h2>

        <!-- Followed searches -->
        <h3 class="like-h4">Followed searches</h3>
        <div
          v-if="!profileData && profileLoading"
          class="profile-loading h-20"
        />
        <div
          v-if="
            profileData &&
            (!profileData.followed_searches?.data ||
              profileData.followed_searches.data.length === 0)
          "
        >
          <p class="text-lg">
            Make a search from the homepage and click "follow" to see it here.
          </p>
        </div>
        <ProfileTable
          v-else
          :items="followedSearches"
          :data-test="TEST_IDS.profile_followed_searches_table"
        >
          <template #left="{ item }">
            <p class="flex items-center justify-start">
              {{ getFullLocationText(item) }}
            </p>
          </template>
          <template #center><span /></template>
          <template #right="{ item }">
            <Button
              class="h-full w-full max-w-full text-right"
              intent="tertiary"
              type="button"
              :disabled="unFollowIsLoading"
              :is-loading="unFollowIsLoading"
              :data-test="TEST_IDS.profile_unfollow_button"
              @keydown.stop.prevent.enter="() => unFollow(item)"
              @click.stop.prevent="() => unFollow(item)"
            >
              <FontAwesomeIcon :icon="faCircleXmark" />
              Unfollow
            </Button>
          </template>
        </ProfileTable>

        <!-- Recent searches -->
        <h3 class="like-h4">Recent searches</h3>
        <div v-if="!profileData && profileLoading" class="h-20" />
        <div
          v-if="
            profileData &&
            (!profileData.recent_searches?.data ||
              profileData.recent_searches.data.length === 0)
          "
        >
          <p class="text-lg">Make a search from the homepage to see it here.</p>
        </div>
        <ProfileTable v-else :items="recentSearches">
          <template #left="{ item }">
            <div v-if="item.record_categories.length" class="max-1/3">
              <p
                v-for="category of item.record_categories"
                :key="category"
                class="pill w-max text-xxs"
              >
                <RecordTypeIcon :record-type="category" />
                {{ category }}
              </p>
            </div>
          </template>
          <template #center="{ item }">
            <p class="flex items-center justify-start">
              {{ getFullLocationText(item) }}
            </p>
          </template>
          <template #right>
            <span />
          </template>
        </ProfileTable>
        <!-- Requests -->
        <h3 class="like-h4">My requests</h3>
        <div
          v-if="!profileData && profileLoading"
          class="profile-loading h-20"
        />
        <div
          v-if="
            profileData &&
            (!profileData.data_requests?.data ||
              profileData.data_requests.data.length === 0)
          "
        >
          <p class="text-lg">
            To open a Data Request,
            <RouterLink to="/data-request/create">start here.</RouterLink>
          </p>
        </div>
        <ProfileTable v-else :items="requests">
          <template #left="{ item }">
            <p>
              {{ item.title }}
            </p>
          </template>
          <template #center="{ item }">
            <p
              v-for="(location, i) of item.locations"
              :key="'profile-request' + getFullLocationText(location)"
            >
              {{
                getFullLocationText(location) +
                (i === item.locations.length - 1 ? '' : ', ')
              }}
            </p>
          </template>
          <template #right="{ item }">
            <a
              v-if="item.github_issue_url"
              :href="item.github_issue_url"
              target="_blank"
              rel="noopener noreferrer"
              @keydown.stop.enter=""
              @click.stop=""
            >
              <FontAwesomeIcon :icon="faLink" />
              GitHub
            </a>
          </template>
        </ProfileTable>
      </template>
    </ErrorBoundary>
  </main>
</template>

<script setup>
import { Button, RecordTypeIcon, ErrorBoundary } from 'pdap-design-system';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import ProfileAPIKey from './_components/APIKey.vue';
import ProfileTable from './_components/ThreeColumnTable.vue';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { generateAPIKey } from '@/api/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { PROFILE } from '@/util/queryKeys';
import { useAuthStore } from '@/stores/auth';
import { getFullLocationText } from '@/util/locationFormatters';
import { deleteFollowedSearch } from '@/api/search';
import { linkAccountWithGithub, signOut, beginOAuthLogin } from '@/api/auth';
import { getUser } from '@/api/user';
import { computed, onMounted } from 'vue';
import { SEARCH_FOLLOWED } from '@/util/queryKeys';
import { TEST_IDS } from '../../../e2e/fixtures/test-ids';

const route = useRoute();
const router = useRouter();

const auth = useAuthStore();

const queryClient = useQueryClient();

// Query
const {
  data: profileData,
  error: profileError,
  isLoading: profileLoading,
  refetch: refetchProfile
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
// Mutations
const {
  data: didLinkGithub,
  mutate: completeGithubAuth,
  isLoading: githubAuthIsLoading
} = useMutation({
  mutationFn: async () => {
    let linked = false;

    const githubAccessToken = route.query.gh_access_token;

    if (githubAccessToken) {
      await linkAccountWithGithub(githubAccessToken);
      linked = true;
    }

    return linked;
  },
  onError: (err) => {
    if (err)
      toast.error(
        err.message ?? 'Error linking your github account, please try again.'
      );
  },
  onSuccess: (data) => {
    if (data) {
      toast.success('Successfully linked Github account');
    }
    queryClient.invalidateQueries({ queryKey: [PROFILE] });
  }
});

const { mutate: unFollow, isLoading: unFollowIsLoading } = useMutation({
  mutationFn: async (followed) => {
    const text = getFullLocationText(followed);
    await deleteFollowedSearch(followed.id ?? followed.location_id);
    toast.success(`Un-followed search for ${text}`);
    await refetchProfile();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [SEARCH_FOLLOWED] });
  },
  onError: (err) => {
    if (err instanceof Error) {
      console.error(err);
    }
    toast.error(`Error un-following search, please try again.`);
  }
});

const {
  data: apiKey,
  mutate: recreateAPIKey,
  isLoading: apiKeyIsLoading,
  reset: resetAPIKeyData
} = useMutation({
  mutationFn: async () => {
    const response = await generateAPIKey();
    return response.data.api_key;
  },
  onError: (err) => {
    if (err instanceof Error) {
      console.error(err);
    }
    toast.error(`Error re-generating API key, please try again.`);
  }
});

const requests = computed(() =>
  profileData.value?.data_requests.data.map((req) => ({
    ...req,
    to: `/data-request/${req.id}`
  }))
);
const followedSearches = computed(() =>
  profileData.value?.followed_searches.data.map((search) => {
    const params = new URLSearchParams({ location_id: search.location_id });

    return {
      ...search,
      to: `/search/results?${params.toString()}`
    };
  })
);
const recentSearches = computed(() =>
  profileData.value?.recent_searches.data.map((search) => {
    const allAt = search.record_categories.indexOf('All');
    const catWithOutAll =
      allAt === -1
        ? search.record_categories
        : search.record_categories.splice(allAt);
    const params = new URLSearchParams({
      location_id: search.location_id,
      ...(catWithOutAll.length
        ? {
            record_categories: [...catWithOutAll]
          }
        : {})
    });

    return {
      ...search,
      to: `/search/results?${params.toString()}`
    };
  })
);

onMounted(() => {
  if (route.query.gh_access_token) {
    completeGithubAuth();
    router.replace({ query: { ...route.query, gh_access_token: undefined } });
  }
});

async function signOutWithRedirect() {
  auth.setRedirectTo(route);
  await signOut();
  router.replace('/sign-in');
}
</script>

<style scoped>
@tailwind utilities;
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>

<style>
.profile-loading {
  position: relative;
}

.profile-loading > * {
  opacity: 0;
}

/* Apply loading shimmer effect when parent is loading */
:where([class*='profile-loading']) {
  @apply animate-pulse;
}

.profile-loading {
  position: relative;
  background: #e5e7eb;
  overflow: hidden;
}

.profile-loading::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(var(--color-gold-neutral-400)) 0,
    rgba(var(--color-gold-neutral-500), 0.2) 20%,
    rgba(var(--color-gold-neutral-700), 0.5) 60%,
    rgba(var(--color-gold-neutral-800), 0)
  );
  animation: shimmer 2s infinite;
  content: '';
  z-index: 999;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .profile-loading::after {
    background-image: linear-gradient(
      90deg,
      rgba(var(--color-wine-neutral-100)) 0,
      rgba(var(--color-wine-neutral-100), 0.2) 20%,
      rgba(var(--color-wine-neutral-100), 0.2) 30%,
      rgba(var(--color-wine-neutral-100), 0)
    );
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

import axios from 'axios';

const GITHUB_BASE = 'https://api.github.com';

export async function getPdapRepositories() {
  return await axios.get(
    `${GITHUB_BASE}/orgs/Police-Data-Accessibility-Project/repos`
  );
}

export async function getPdapPRsMerged() {
  return await axios.get(
    `${GITHUB_BASE}/search/issues?q=org:Police-Data-Accessibility-Project+is:pr+is:merged`
  );
}

export async function getPdapIssues() {
  return await axios.get(
    `${GITHUB_BASE}/search/issues?q=org:Police-Data-Accessibility-Project+label:"good first issue"+state:open+-label:"resolved in dev"&sort=created&order=desc&per_page=3`
  );
}

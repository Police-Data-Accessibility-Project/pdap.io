import UrlHealthPill from '../UrlHealthPill.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { TEST_IDS } from '../../../../../e2e/fixtures/test-ids';

describe('UrlHealthPill', () => {
  it('renders nothing when status is missing', () => {
    const wrapper = mount(UrlHealthPill, {
      props: { urlStatus: null, archiveUrl: null }
    });
    expect(
      wrapper.find(`[data-test="${TEST_IDS.data_source_url_health}"]`).exists()
    ).toBe(false);
  });

  it('renders healthy state for "ok"', () => {
    const wrapper = mount(UrlHealthPill, {
      props: { urlStatus: 'ok', archiveUrl: null }
    });
    const pill = wrapper.find(
      `[data-test="${TEST_IDS.data_source_url_health}"]`
    );
    expect(pill.exists()).toBe(true);
    expect(pill.text()).toContain('URL healthy');
    expect(pill.classes()).toContain('tone-ok');
  });

  it('renders archived state when broken and archive url present', () => {
    const wrapper = mount(UrlHealthPill, {
      props: { urlStatus: 'broken', archiveUrl: 'https://web.archive.org/abc' }
    });
    const pill = wrapper.find(
      `[data-test="${TEST_IDS.data_source_url_health}"]`
    );
    expect(pill.text()).toContain('Archived copy available');
    expect(pill.classes()).toContain('tone-archived');
    const archiveLink = wrapper.find(
      `[data-test="${TEST_IDS.data_source_url_archive}"]`
    );
    expect(archiveLink.exists()).toBe(true);
    expect(archiveLink.attributes('href')).toBe('https://web.archive.org/abc');
  });

  it('renders broken state when broken without archive', () => {
    const wrapper = mount(UrlHealthPill, {
      props: { urlStatus: 'broken', archiveUrl: null }
    });
    const pill = wrapper.find(
      `[data-test="${TEST_IDS.data_source_url_health}"]`
    );
    expect(pill.text()).toContain('URL broken');
    expect(pill.classes()).toContain('tone-broken');
    expect(
      wrapper.find(`[data-test="${TEST_IDS.data_source_url_archive}"]`).exists()
    ).toBe(false);
  });

  it('is case-insensitive for status value', () => {
    const wrapper = mount(UrlHealthPill, {
      props: { urlStatus: 'OK', archiveUrl: null }
    });
    expect(
      wrapper.find(`[data-test="${TEST_IDS.data_source_url_health}"]`).text()
    ).toContain('URL healthy');
  });
});

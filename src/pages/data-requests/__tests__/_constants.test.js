import { describe, expect, it } from 'vitest';
import { SCHEMA, INPUT_NAMES } from '../_constants';

describe('data request form schema', () => {
  it('enforces a 255-character maxLength on the title field', () => {
    const titleSchema = SCHEMA.find(
      (field) => field.name === INPUT_NAMES.title
    );

    expect(titleSchema).toBeDefined();
    expect(titleSchema.validators.maxLength).toEqual({
      value: 255,
      message: 'Title must be 255 characters or fewer.'
    });
  });

  it('requires the title field', () => {
    const titleSchema = SCHEMA.find(
      (field) => field.name === INPUT_NAMES.title
    );

    expect(titleSchema.validators.required).toEqual({
      value: true,
      message: 'Please let us know what to call this request.'
    });
  });
});

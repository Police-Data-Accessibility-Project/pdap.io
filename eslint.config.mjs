import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Use recommendedTypeChecked for rules requiring type information
  {
    // You can add specific rules or overrides here
    // files: ['**/*.ts', '**/*.tsx'], // Specify files to apply this config to
    // rules: {
    //   '@typescript-eslint/no-unused-vars': 'warn',
    // },
  }
);
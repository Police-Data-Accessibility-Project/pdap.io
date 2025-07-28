# Email Verification Tests

This directory contains end-to-end tests for flows that require email verification:
- Sign-up verification
- Password reset

## Setup

1. Make sure you have the following environment variables set:
   ```
   MAILGUN_KEY=your_mailgun_api_key
   MAILGUN_DOMAIN=pdap.io  # or your custom domain
   E2E_SIGNUP_EMAIL=e2e_signup_dev@pdap.io  # test email address
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. The tests use `e2e_signup_dev@pdap.io` as the test email address. Make sure this email is configured in your Mailgun account to store incoming messages.

## Running Tests

Run the email verification tests:

```bash
# Run all auth tests
npm run test:e2e -- e2e/auth/

# Run specific test
npm run test:e2e -- e2e/auth/sign-up-verification.spec.js
npm run test:e2e -- e2e/auth/password-reset.spec.js
```

## How It Works

1. The tests submit forms with the test email address
2. The Mailgun helper polls the Mailgun API for incoming emails
3. When an email is received, it extracts the verification/reset URL
4. The test navigates to the URL to complete the flow
5. Assertions verify the flow completed successfully

## Troubleshooting

- **No emails received**: Check that your Mailgun account is properly configured to receive and store emails
- **URL extraction fails**: The regex patterns may need adjustment based on your actual email templates
- **API errors**: Verify your Mailgun API key has the correct permissions

## Notes

- These tests use real email delivery, so they may take longer to run than other tests
- Consider running them separately from your main test suite if speed is a concern
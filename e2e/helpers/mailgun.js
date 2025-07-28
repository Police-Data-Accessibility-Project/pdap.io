const fetch = require('node-fetch');

/**
 * Helper class to interact with Mailgun API for e2e tests
 */
class MailgunHelper {
  constructor() {
    this.apiKey = process.env.MAILGUN_KEY;
    this.domain = process.env.MAILGUN_DOMAIN || 'pdap.io';
    this.baseUrl = `https://api.mailgun.net/v1`;

    if (!this.apiKey) {
      throw new Error('MAILGUN_KEY environment variable is required');
    }
  }

  /**
   * Get the most recent email for a specific recipient
   * @param {string} recipient - Email address to check
   * @param {number} retryCount - Number of retries (default: 10)
   * @param {number} retryDelay - Delay between retries in ms (default: 2000)
   * @returns {Promise<Object>} - Email data
   */
  async getLatestEmailFor(recipient, retryCount = 10, retryDelay = 2000) {
    // Record the time when we start looking for emails
    const searchStartTime = new Date();
    
    for (let i = 0; i < retryCount; i++) {
      try {
        // Format dates exactly as in the example
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 10); // Look back 10 minutes

        // Format: "Mon, 21 Jul 2025 00:00:00 -0000"
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];

        const startDate = `${days[startTime.getUTCDay()]}, ${startTime.getUTCDate()} ${months[startTime.getUTCMonth()]} ${startTime.getUTCFullYear()} ${startTime.getUTCHours()}:${String(startTime.getUTCMinutes()).padStart(2, '0')}:${String(startTime.getUTCSeconds()).padStart(2, '0')} -0000`;

        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Set 5 minutes in the future
        const endDate = `${days[now.getUTCDay()]}, ${now.getUTCDate()} ${months[now.getUTCMonth()]} ${now.getUTCFullYear()} ${now.getUTCHours()}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} -0000`;

        // Use the analytics logs endpoint
        const url = `${this.baseUrl}/analytics/logs`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            start: startDate,
            end: endDate,
            ascending: 'no' // Get newest logs first
          })
        });

        if (!response.ok) {
          throw new Error(
            `Mailgun API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          console.log(`Found ${data.items.length} total log items`);

          // Log all recipients to debug
          const allRecipients = data.items
            .map((item) => item.recipient)
            .filter(Boolean);
          console.log('All recipients found:', [...new Set(allRecipients)]);

          // Find delivered messages to our recipient
          const deliveredLogs = data.items.filter(
            (item) =>
              (item.event === 'delivered' || item.event === 'accepted') &&
              item.recipient === recipient
          );

          console.log(
            `Found ${deliveredLogs.length} delivered logs for ${recipient}`
          );

          if (deliveredLogs.length > 0) {
            // Sort by timestamp to get the most recent
            deliveredLogs.sort((a, b) => {
              return new Date(b['@timestamp']) - new Date(a['@timestamp']);
            });

            // Get the most recent log
            const latestLog = deliveredLogs[0];

            // Get the storage URL for the message
            const storageUrl = latestLog.storage?.url?.[0];

            if (storageUrl) {
              // Fetch the full message content
              const messageResponse = await fetch(storageUrl, {
                headers: {
                  Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`
                }
              });

              if (!messageResponse.ok) {
                throw new Error(
                  `Failed to fetch message: ${messageResponse.status} ${messageResponse.statusText}`
                );
              }

              const messageData = await messageResponse.json();

              return {
                body: {
                  html: messageData['body-html'] || '',
                  text: messageData['body-plain'] || ''
                }
              };
            }
          }
        }

        console.log(
          `Email not found for ${recipient}, retrying... (${i + 1}/${retryCount})`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } catch (error) {
        console.error('Error fetching email:', error);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error(
      `No email found for ${recipient} after ${retryCount} attempts`
    );
  }

  /**
   * Extract verification URL from email body
   * @param {string} emailBody - HTML or text body of the email
   * @returns {string} - Extracted verification URL
   */
  extractVerificationUrl(emailBody) {
    // Extract token directly
    const tokenMatch = emailBody.match(/token=([^'\s>]+)/);
    if (tokenMatch) {
      return `/validate/email?token=${tokenMatch[1]}`;
    }
    throw new Error('Verification URL not found in email');
  }

  /**
   * Extract password reset URL from email body
   * @param {string} emailBody - HTML or text body of the email
   * @returns {string} - Extracted reset URL
   */
  extractPasswordResetUrl(emailBody) {
    // Extract token directly
    const tokenMatch = emailBody.match(/token=([^'\s>]+)/);
    if (tokenMatch) {
      return `/reset-password?token=${tokenMatch[1]}`;
    }
    throw new Error('Password reset URL not found in email');
  }
}

module.exports = { MailgunHelper };

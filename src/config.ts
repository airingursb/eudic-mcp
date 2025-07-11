/**
 * Configuration management for Eudic MCP Server
 */

export interface EudicConfig {
  authorizationToken: string;
  apiBaseUrl: string;
  userAgent: string;
}

export function getConfig(): EudicConfig {
  const authToken = process.env.EUDIC_AUTH_TOKEN;
  
  if (!authToken) {
    throw new Error(
      'EUDIC_AUTH_TOKEN environment variable is required. ' +
      'Set it to your Eudic authorization token (format: "NIS your_token")'
    );
  }

  return {
    authorizationToken: authToken,
    apiBaseUrl: process.env.EUDIC_API_BASE_URL || 'https://api.frdic.com',
    userAgent: process.env.EUDIC_USER_AGENT || 'Mozilla/5.0'
  };
}
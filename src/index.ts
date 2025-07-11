#!/usr/bin/env node

/**
 * Eudic MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getConfig } from './config.js';
import { EudicClient, SaveWordRequest } from './client.js';

const server = new Server(
  {
    name: 'eudic-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'save_word',
        description: 'Save a word to Eudic study list with optional context and categorization',
        inputSchema: {
          type: 'object',
          properties: {
            word: {
              type: 'string',
              description: 'The word to save to Eudic study list'
            },
            language: {
              type: 'string',
              description: 'Language of the word',
              default: 'en'
            },
            star: {
              type: 'number',
              description: 'Star rating for the word (1-5)',
              minimum: 1,
              maximum: 5,
              default: 2
            },
            context_line: {
              type: 'string',
              description: 'Context sentence containing the word'
            },
            category_ids: {
              type: 'array',
              items: { type: 'number' },
              description: 'List of category IDs for organizing the word',
              default: [0]
            }
          },
          required: ['word']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'save_word') {
    try {
      const config = getConfig();
      const client = new EudicClient(config);
      
      if (!args) {
        throw new Error('Arguments are required for save_word tool');
      }
      
      const saveRequest: SaveWordRequest = {
        word: args.word as string,
        language: args.language as string | undefined,
        star: args.star as number | undefined,
        context_line: args.context_line as string | undefined,
        category_ids: args.category_ids as number[] | undefined
      };

      const result = await client.saveWord(saveRequest);

      return {
        content: [
          {
            type: 'text',
            text: `Successfully saved word '${saveRequest.word}' to Eudic study list. Response: ${JSON.stringify(result, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error saving word to Eudic: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  } else {
    throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
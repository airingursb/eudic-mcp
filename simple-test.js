#!/usr/bin/env node

/**
 * Simple manual test for Eudic MCP Server
 */

import { EudicClient } from './dist/client.js';
import { getConfig } from './dist/config.js';

async function testEudicClient() {
  console.log('🧪 Testing Eudic Client directly...\n');
  
  try {
    // Set test environment
    process.env.EUDIC_AUTH_TOKEN = "NIS 6qvjLOPAaCUbARaOXUASNiGhbeByVi2xHdtUnzIZG7tHHaP7wBIokw==";
    
    // Test configuration
    console.log('1️⃣ Testing configuration...');
    const config = getConfig();
    console.log(`✅ Config loaded: ${config.authorizationToken.substring(0, 20)}...`);
    
    // Test client
    console.log('\n2️⃣ Testing client initialization...');
    const client = new EudicClient(config);
    console.log('✅ Client created successfully');
    
    // Test saving a word
    console.log('\n3️⃣ Testing word save...');
    const result = await client.saveWord({
      word: 'test-word',
      language: 'en',
      star: 3,
      context_line: 'This is a test word for debugging.',
      category_ids: [0]
    });
    console.log('✅ Word saved successfully:', result);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testEudicClient();
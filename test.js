#!/usr/bin/env node

/**
 * Simple test script for Eudic MCP Server
 */

import { spawn } from 'child_process';

const TEST_TOKEN = "NIS 6qvjLOPAaCUbARaOXUASNiGhbeByVi2xHdtUnzIZG7tHHaP7wBIokw==";

function testMCPServer(input, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Testing: ${description}`);
    
    const child = spawn('node', ['dist/index.js'], {
      env: { ...process.env, EUDIC_AUTH_TOKEN: TEST_TOKEN },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (error) {
        console.log(`❌ Error: ${error}`);
        reject(error);
      } else {
        try {
          const result = JSON.parse(output);
          console.log(`✅ Success: ${JSON.stringify(result, null, 2)}`);
          resolve(result);
        } catch (e) {
          console.log(`❌ Invalid JSON response: ${output}`);
          reject(e);
        }
      }
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Eudic MCP Server Tests\n');

  try {
    // Test 1: List tools
    await testMCPServer(
      '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}',
      'List available tools'
    );

    // Test 2: Save a word with minimal parameters
    await testMCPServer(
      '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "save_word", "arguments": {"word": "hello"}}}',
      'Save word with minimal parameters'
    );

    // Test 3: Save a word with all parameters
    await testMCPServer(
      '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "save_word", "arguments": {"word": "wonderful", "language": "en", "star": 5, "context_line": "What a wonderful day!", "category_ids": [0, 1]}}}',
      'Save word with all parameters'
    );

    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.log('\n💥 Tests failed:', error);
    process.exit(1);
  }
}

runTests();
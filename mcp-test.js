#!/usr/bin/env node

/**
 * Test MCP Server with proper protocol
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const TEST_TOKEN = "NIS 6qvjLOPAaCUbARaOXUASNiGhbeByVi2xHdtUnzIZG7tHHaP7wBIokw==";

async function testMCPProtocol() {
  console.log('🚀 Testing MCP Protocol with Eudic Server\n');
  
  const child = spawn('node', ['dist/index.js'], {
    env: { ...process.env, EUDIC_AUTH_TOKEN: TEST_TOKEN },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let responses = [];
  
  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        responses.push(response);
        console.log('📨 Received:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('📄 Raw output:', line);
      }
    }
  });

  child.stderr.on('data', (data) => {
    console.error('❌ Error:', data.toString());
  });

  // Test sequence
  try {
    console.log('1️⃣ Sending initialization...');
    child.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
      }
    }) + '\n');

    await setTimeout(1000);

    console.log('\n2️⃣ Listing tools...');
    child.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    }) + '\n');

    await setTimeout(1000);

    console.log('\n3️⃣ Calling save_word tool...');
    child.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "save_word",
        arguments: {
          word: "protocol-test",
          language: "en",
          star: 4,
          context_line: "Testing the MCP protocol implementation."
        }
      }
    }) + '\n');

    await setTimeout(2000);
    
    child.kill();
    console.log('\n✅ MCP Protocol test completed!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    child.kill();
  }
}

testMCPProtocol();
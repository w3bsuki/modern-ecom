#!/usr/bin/env node

/**
 * Performance Testing Script
 * 
 * This script automates the performance testing process using Lighthouse CI.
 * It builds the application, starts a server, runs Lighthouse tests, and then
 * shuts down the server.
 * 
 * Usage:
 *   node scripts/performance-test.js
 * 
 * Requirements:
 *   - @lhci/cli installed (npm install -g @lhci/cli)
 */

const { spawn, execSync } = require('child_process');
const { join } = require('path');
const fs = require('fs');

// Configuration
const PORT = 3000;
const LIGHTHOUSE_CONFIG = join(process.cwd(), '.lighthouserc.js');
const RESULTS_DIR = join(process.cwd(), 'lighthouse-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Helper function to run commands
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

// Function to build the application
async function buildApp() {
  console.log('📦 Building application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Function to start the Next.js server
async function startServer() {
  console.log(`🚀 Starting server on port ${PORT}...`);
  const server = spawn('npm', ['run', 'start', '--', '-p', PORT.toString()], {
    stdio: 'pipe',
    env: { ...process.env, PORT: PORT.toString() },
  });

  // Wait for server to be ready
  return new Promise((resolve) => {
    let isReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Server] ${output.trim()}`);
      
      if (!isReady && output.includes('started server')) {
        isReady = true;
        console.log('✅ Server is ready');
        
        // Give it a little extra time to stabilize
        setTimeout(() => resolve(server), 2000);
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString().trim()}`);
    });
  });
}

// Function to run Lighthouse CI
async function runLighthouse() {
  console.log('🔍 Running Lighthouse tests...');
  try {
    await runCommand('lhci', ['autorun', '--config', LIGHTHOUSE_CONFIG]);
    console.log('✅ Lighthouse tests completed');
  } catch (error) {
    console.error('⚠️ Lighthouse tests finished with warnings or errors');
    // Continue execution as we want to see the results even if some tests fail
  }
}

// Main function
async function main() {
  console.log('🏁 Starting performance testing...');
  
  try {
    // Build the app
    await buildApp();
    
    // Start server
    const server = await startServer();
    
    try {
      // Run Lighthouse
      await runLighthouse();
    } finally {
      // Always terminate the server
      console.log('🛑 Shutting down server...');
      server.kill();
    }
    
    console.log('🎉 Performance testing completed successfully!');
  } catch (error) {
    console.error('❌ Performance testing failed:', error);
    process.exit(1);
  }
}

// Run the script
main(); 
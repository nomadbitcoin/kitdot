import { jest } from '@jest/globals';
import { spawn } from 'child_process';
import path from 'path';

const cliPath = path.resolve('dist/cli.js');

describe('CLI Improvements', () => {
  beforeAll(async () => {
    // Ensure the project is built before running tests
    // This should be done in CI/test setup
  });

  describe('Help Documentation', () => {
    test('should show enhanced help text with Quick Start section', async () => {
      const { stdout } = await runCommand(['--help']);

      expect(stdout).toContain('TypeScript SDK for building Polkadot Dapps with integrated toolchain');
      expect(stdout).toContain('Quick Start:');
      expect(stdout).toContain('kitdot -y                  Create project with default template');
      expect(stdout).toContain('kitdot init                Interactive project creation');
      expect(stdout).toContain('Development Tools:');
      expect(stdout).toContain('📋 Get Started Fast');
      expect(stdout).toContain('Follow these steps to create a full-stack Polkadot Dapp');
      expect(stdout).toContain('kitdot -y');
      expect(stdout).toContain('cd your-project-name');
    });

    test('should show -y flag in init command help', async () => {
      const { stdout } = await runCommand(['init', '--help']);

      expect(stdout).toContain('-y, --yes              Use default template without prompts');
    });

    test('should NOT show build or deploy commands in help', async () => {
      const { stdout } = await runCommand(['--help']);

      // Should not show build or deploy as actual commands
      expect(stdout).not.toContain('build [');
      expect(stdout).not.toContain('deploy [');
      expect(stdout).not.toContain('Commands:\n  build');
      expect(stdout).not.toContain('Commands:\n  deploy');

      // Check the actual commands section doesn't include them
      const commandsSection = stdout.split('Commands:')[1]?.split('Quick Start:')[0] || '';
      expect(commandsSection).not.toMatch(/\bbuild\b/);
      expect(commandsSection).not.toMatch(/\bdeploy\b/);
    });

    test('should show helpful context for tools command', async () => {
      const { stdout } = await runCommand(['tools', '--help']);

      expect(stdout).toContain('Manage development tools (Rust, Pop-CLI, etc.)');
      expect(stdout).toContain('install-rust  Install Rust toolchain for blockchain development');
      expect(stdout).toContain('check         Check status of development tools');
      expect(stdout).toContain('Available tools commands:');
    });

    test('should show helpful context for tools check subcommand', async () => {
      const { stdout } = await runCommand(['tools', 'check', '--help']);

      expect(stdout).toContain('Check status of development tools');
      expect(stdout).toContain('Checks if required development tools are installed and properly configured');
      expect(stdout).toContain('Shows platform information and tool versions');
    });

    test('should show helpful context for tools install-rust subcommand', async () => {
      const { stdout } = await runCommand(['tools', 'install-rust', '--help']);

      expect(stdout).toContain('Install Rust toolchain for blockchain development');
      expect(stdout).toContain('Installs the Rust toolchain required for Polkadot smart contract development');
      expect(stdout).toContain('This includes rustc, cargo, and wasm32 target for WebAssembly compilation');
    });
  });

  describe('-y Flag Functionality', () => {
    test('should accept -y flag with init command', async () => {
      // Note: This test verifies argument parsing, not full execution
      // to avoid creating actual projects during testing
      const { stderr } = await runCommand(['init', '-y', 'test-project'], { expectFailure: true });

      // Should not complain about unknown -y flag
      expect(stderr).not.toContain('unknown option');
      expect(stderr).not.toContain('error: unknown option \'-y\'');
    });

    test('should accept top-level -y flag', async () => {
      // Note: This test verifies argument parsing, not full execution
      const { stderr } = await runCommand(['-y'], { expectFailure: true });

      // Should not complain about unknown -y flag at top level
      expect(stderr).not.toContain('unknown option');
      expect(stderr).not.toContain('error: unknown option \'-y\'');
    });

    test('should still prompt for project name when using -y flag', async () => {
      // The -y flag should only skip template selection, not project name
      // This is verified by ensuring the CLI still waits for input when no project name is provided
      const child = spawn('node', [cliPath, '-y'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'test' }
      });

      let stdout = '';
      let hasPrompted = false;

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
        if (stdout.includes('What is your project name?')) {
          hasPrompted = true;
          child.kill('SIGTERM');
        }
      });

      // Give it time to start and show the prompt
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!hasPrompted) {
        child.kill('SIGTERM');
      }

      // Should prompt for project name even with -y flag
      expect(hasPrompted).toBe(true);
    });
  });

  describe('Command Removal', () => {
    test('should not have build command', async () => {
      const { stderr } = await runCommand(['build'], { expectFailure: true });

      expect(stderr).toContain('Unknown command');
    });

    test('should not have deploy command', async () => {
      const { stderr } = await runCommand(['deploy'], { expectFailure: true });

      expect(stderr).toContain('Unknown command');
    });
  });
});

// Helper function to run CLI commands
function runCommand(args: string[], options: { expectFailure?: boolean } = {}): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Prevent hanging by setting up timeout
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
    }, 5000);

    child.on('close', (exitCode) => {
      clearTimeout(timeout);
      if (options.expectFailure || exitCode === 0) {
        resolve({ stdout, stderr, exitCode: exitCode || 0 });
      } else {
        reject(new Error(`Command failed with exit code ${exitCode}. stderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}
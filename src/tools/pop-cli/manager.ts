import { execSync, spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { homedir, platform } from 'os';
import { PopCliInstaller } from './installer.js';

export interface PopCliCommandOptions {
  skipConfirm?: boolean;
  timeout?: number;
  workingDir?: string;
  args?: string[];
}

export interface PopCliExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

export interface ChainLaunchOptions {
  chainType?: 'development' | 'local' | 'testnet';
  skipConfirm?: boolean;
  customArgs?: string[];
}

export class PopCliManager {
  private installer: PopCliInstaller;
  private readonly toolsDir: string;

  constructor() {
    this.installer = new PopCliInstaller();
    this.toolsDir = join(homedir(), '.kit-dot', 'tools');
  }

  /**
   * Check if Pop-CLI is installed and accessible
   * @returns boolean indicating if Pop-CLI is ready to use
   */
  public async checkInstallation(): Promise<boolean> {
    try {
      return await this.installer.isToolInstalled();
    } catch {
      return false;
    }
  }

  /**
   * Get Pop-CLI version information
   * @returns string with version or null if not available
   */
  public async getVersion(): Promise<string | null> {
    try {
      return await this.installer.getToolVersion();
    } catch {
      return null;
    }
  }

  /**
   * Execute a Pop-CLI command with specified options
   * @param command The Pop-CLI subcommand to execute
   * @param options Execution options
   * @returns Promise<PopCliExecutionResult>
   */
  public async execute(command: string, options: PopCliCommandOptions = {}): Promise<PopCliExecutionResult> {
    const isInstalled = await this.checkInstallation();
    if (!isInstalled) {
      return {
        success: false,
        error: 'Pop-CLI is not installed. Please install it first using kit-dot tools install-pop-cli',
        exitCode: -1
      };
    }

    try {
      const popBinary = await this.getPopBinaryPath();
      if (!popBinary) {
        return {
          success: false,
          error: 'Pop-CLI binary not found',
          exitCode: -1
        };
      }

      // Build command arguments
      const args = command.split(' ').filter(arg => arg.length > 0);
      
      // Add skip-confirm flag if requested
      if (options.skipConfirm && !args.includes('--skip-confirm')) {
        args.push('--skip-confirm');
      }

      // Add any custom arguments
      if (options.args) {
        args.push(...options.args);
      }

      // Execute command
      const result = await this.executeCommand(popBinary, args, options);
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Pop-CLI execution failed: ${error}`,
        exitCode: -1
      };
    }
  }

  /**
   * Launch a blockchain development chain
   * @param options Chain launch options
   * @returns Promise<PopCliExecutionResult>
   */
  public async launchChain(options: ChainLaunchOptions = {}): Promise<PopCliExecutionResult> {
    const chainType = options.chainType || 'development';
    const args = ['up', 'chain'];

    // Add chain type specific arguments
    switch (chainType) {
      case 'development':
        args.push('--dev');
        break;
      case 'local':
        args.push('--local');
        break;
      case 'testnet':
        args.push('--testnet');
        break;
    }

    // Add custom arguments
    if (options.customArgs) {
      args.push(...options.customArgs);
    }

    const command = args.join(' ');
    return this.execute(command, {
      skipConfirm: options.skipConfirm,
      timeout: 300000 // 5 minutes for chain startup
    });
  }

  /**
   * Stop a running blockchain chain
   * @param options Command options
   * @returns Promise<PopCliExecutionResult>
   */
  public async stopChain(options: PopCliCommandOptions = {}): Promise<PopCliExecutionResult> {
    return this.execute('down chain', {
      skipConfirm: true,
      ...options
    });
  }

  /**
   * Get chain status information
   * @returns Promise<PopCliExecutionResult>
   */
  public async getChainStatus(): Promise<PopCliExecutionResult> {
    return this.execute('status chain', {
      timeout: 10000 // 10 seconds
    });
  }

  /**
   * Create a new parachain project
   * @param projectName Name of the parachain project
   * @param options Command options
   * @returns Promise<PopCliExecutionResult>
   */
  public async createParachain(projectName: string, options: PopCliCommandOptions = {}): Promise<PopCliExecutionResult> {
    if (!projectName || projectName.trim().length === 0) {
      return {
        success: false,
        error: 'Project name is required',
        exitCode: -1
      };
    }

    const command = `new parachain ${projectName.trim()}`;
    return this.execute(command, {
      skipConfirm: options.skipConfirm || true,
      ...options
    });
  }

  /**
   * Execute Pop-CLI command as a background process
   * @param command The Pop-CLI subcommand
   * @param options Execution options
   * @returns ChildProcess instance for monitoring
   */
  public async executeBackground(command: string, options: PopCliCommandOptions = {}): Promise<ChildProcess | null> {
    const isInstalled = await this.checkInstallation();
    if (!isInstalled) {
      throw new Error('Pop-CLI is not installed');
    }

    const popBinary = await this.getPopBinaryPath();
    if (!popBinary) {
      throw new Error('Pop-CLI binary not found');
    }

    // Build command arguments
    const args = command.split(' ').filter(arg => arg.length > 0);
    
    if (options.skipConfirm && !args.includes('--skip-confirm')) {
      args.push('--skip-confirm');
    }

    if (options.args) {
      args.push(...options.args);
    }

    // Spawn background process
    const childProcess = spawn(popBinary, args, {
      stdio: 'pipe',
      cwd: options.workingDir || process.cwd(),
      detached: false
    });

    return childProcess;
  }

  /**
   * Get the path to the Pop-CLI binary
   * @returns Promise<string | null>
   */
  private async getPopBinaryPath(): Promise<string | null> {
    // Check system PATH first
    try {
      execSync('pop --version', { stdio: 'pipe', timeout: 3000 });
      return 'pop'; // Available in system PATH
    } catch {
      // Check our tools directory
      const binaryName = platform() === 'win32' ? 'pop.exe' : 'pop';
      const potentialPaths = [
        join(this.toolsDir, binaryName),
        join(this.toolsDir, 'bin', binaryName)
      ];

      for (const path of potentialPaths) {
        try {
          execSync(`"${path}" --version`, { stdio: 'pipe', timeout: 3000 });
          return path;
        } catch {
          continue;
        }
      }
    }

    return null;
  }

  /**
   * Execute a command with the Pop-CLI binary
   * @param binaryPath Path to the Pop-CLI binary
   * @param args Command arguments
   * @param options Execution options
   * @returns Promise<PopCliExecutionResult>
   */
  private async executeCommand(
    binaryPath: string, 
    args: string[], 
    options: PopCliCommandOptions = {}
  ): Promise<PopCliExecutionResult> {
    return new Promise((resolve) => {
      const timeout = options.timeout || 120000; // 2 minutes default
      const workingDir = options.workingDir || process.cwd();

      const childProcess = spawn(binaryPath, args, {
        stdio: 'pipe',
        cwd: workingDir
      });

      let output = '';
      let errorOutput = '';

      // Collect stdout
      childProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      // Collect stderr
      childProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Handle process completion
      childProcess.on('close', (code) => {
        resolve({
          success: code === 0,
          output: output.trim(),
          error: errorOutput.trim() || undefined,
          exitCode: code || 0
        });
      });

      // Handle process errors
      childProcess.on('error', (error) => {
        resolve({
          success: false,
          error: `Process error: ${error.message}`,
          exitCode: -1
        });
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        childProcess.kill('SIGTERM');
        resolve({
          success: false,
          error: `Command timeout after ${timeout / 1000} seconds`,
          exitCode: -1
        });
      }, timeout);

      // Clear timeout on completion
      childProcess.on('close', () => {
        clearTimeout(timeoutId);
      });
    });
  }

  /**
   * Get available Pop-CLI commands and their descriptions
   * @returns Promise<PopCliExecutionResult> with help output
   */
  public async getHelp(): Promise<PopCliExecutionResult> {
    return this.execute('--help', {
      timeout: 10000
    });
  }

  /**
   * Validate that Pop-CLI has chain features enabled
   * @returns Promise<boolean>
   */
  public async validateChainFeatures(): Promise<boolean> {
    try {
      const result = await this.execute('up --help');
      // Check if chain-related commands are available
      return result.success && (result.output?.includes('chain') || false);
    } catch {
      return false;
    }
  }
}
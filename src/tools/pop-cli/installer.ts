import { execSync, spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir, platform } from 'os';
import { PlatformDetector, SupportedPlatform } from '../platform-detector.js';
import { RustInstaller } from '../rust-installer.js';
import { ToolInstaller, ToolInstallationResult } from '../manager.js';

export interface PopCliInstallationOptions {
  skipPreCompiled?: boolean;
  skipCargo?: boolean;
  forceSource?: boolean;
  timeout?: number;
}

export class PopCliInstaller implements ToolInstaller {
  private platformDetector: PlatformDetector;
  private rustInstaller: RustInstaller;
  private readonly toolsDir: string;

  constructor() {
    this.platformDetector = PlatformDetector.getInstance();
    this.rustInstaller = new RustInstaller();
    this.toolsDir = join(homedir(), '.kit-dot', 'tools');
  }

  /**
   * Checks if Pop-CLI is already installed
   * @returns boolean indicating if Pop-CLI is available
   */
  public async isToolInstalled(): Promise<boolean> {
    try {
      // Check both system PATH and our tools directory
      const systemInstalled = await this.checkSystemInstallation();
      if (systemInstalled) return true;

      // Check our tools directory
      const toolsInstalled = await this.checkToolsDirectoryInstallation();
      return toolsInstalled;
    } catch {
      return false;
    }
  }

  /**
   * Gets the currently installed Pop-CLI version
   * @returns string with version or null if not installed
   */
  public async getToolVersion(): Promise<string | null> {
    try {
      // Try system installation first
      try {
        const output = execSync('pop --version', { 
          stdio: 'pipe', 
          timeout: 5000,
          encoding: 'utf8'
        });
        return output.trim();
      } catch {
        // Try our tools directory
        const popPaths = [
          join(this.toolsDir, platform() === 'win32' ? 'pop.exe' : 'pop'),
          join(this.toolsDir, 'bin', platform() === 'win32' ? 'pop.exe' : 'pop')
        ];
        
        for (const popPath of popPaths) {
          try {
            const output = execSync(`"${popPath}" --version`, {
              stdio: 'pipe',
              timeout: 5000,
              encoding: 'utf8'
            });
            return output.trim();
          } catch {
            continue;
          }
        }
        return null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Installs Pop-CLI using multi-strategy approach
   * @param platform The detected platform
   * @param options Installation options
   * @returns Promise<ToolInstallationResult>
   */
  public async installTool(platform: SupportedPlatform, options: PopCliInstallationOptions = {}): Promise<ToolInstallationResult> {
    return this.installPopCli(platform, options);
  }

  /**
   * Main Pop-CLI installation method with fallback strategies
   * @param platform The detected platform
   * @param options Installation options
   * @returns Promise<ToolInstallationResult>
   */
  public async installPopCli(detectedPlatform: SupportedPlatform, options: PopCliInstallationOptions = {}): Promise<ToolInstallationResult> {
    // Ensure tools directory exists
    await this.ensureToolsDirectory();

    // Check if Rust is available (required for building Pop-CLI)
    const isRustAvailable = await this.rustInstaller.isToolInstalled();
    if (!isRustAvailable) {
      return {
        success: false,
        platform: detectedPlatform,
        error: 'Rust toolchain is required to build Pop-CLI. Please install Rust first.',
        skipped: false
      };
    }

    // Check if protoc is available (required for building Pop-CLI)
    const isProtocAvailable = await this.checkProtocInstallation();
    if (!isProtocAvailable) {
      return {
        success: false,
        platform: detectedPlatform,
        error: 'Protocol Buffers compiler (protoc) is required to build Pop-CLI. Please install protobuf-compiler.',
        skipped: false
      };
    }

    // Strategy: Build from source using degit + cargo build
    try {
      const sourceResult = await this.installFromSourceWithDegit(detectedPlatform, options.timeout);
      if (sourceResult.success) {
        await this.updatePath();
        return sourceResult;
      }
      // If not successful, return the specific error from degit strategy
      if (sourceResult.error) {
        return sourceResult;
      }
    } catch (error) {
      console.warn('Source compilation with degit failed:', error);
    }

    // Fallback: Traditional git clone + cargo build
    try {
      const sourceResult = await this.installFromSource(detectedPlatform, options.timeout);
      if (sourceResult.success) {
        await this.updatePath();
        return sourceResult;
      }
      // If not successful, return the specific error from git strategy
      if (sourceResult.error) {
        return sourceResult;
      }
    } catch (error) {
      console.warn('Source compilation failed:', error);
    }

    // Installation failed
    return {
      success: false,
      platform: detectedPlatform,
      error: 'Pop-CLI installation failed. Rust toolchain and Git are required.',
      skipped: false
    };
  }

  // Removed GitHub releases and cargo install strategies
  // Pop-CLI installation now only supports building from source

  /**
   * Strategy 1: Install from source using degit + cargo build (preferred method)
   */
  private async installFromSourceWithDegit(platform: SupportedPlatform, timeout = 20 * 60 * 1000): Promise<ToolInstallationResult> {
    try {
      const sourceDir = join(this.toolsDir, 'pop-cli-source');
      
      // Use degit to clone repository (faster than git clone)
      try {
        execSync(`npx degit r0gue-io/pop-cli "${sourceDir}"`, {
          stdio: 'pipe',
          timeout: 60000
        });
      } catch {
        // Fallback to regular git clone if degit fails
        execSync(`git clone --depth 1 https://github.com/r0gue-io/pop-cli.git "${sourceDir}"`, {
          stdio: 'pipe',
          timeout: 60000
        });
      }

      // Build with chain features only using release profile
      return new Promise((resolve) => {
        const args = [
          'build',
          '--release',
          '--no-default-features',
          '--features', 'chain'
        ];

        // Use full path to cargo to handle PATH issues
        const cargoPath = join(homedir(), '.cargo', 'bin', 'cargo');
        const cargoProcess = spawn(cargoPath, args, {
          stdio: 'pipe',
          cwd: sourceDir
        });

        let buildOutput = '';
        let errorOutput = '';

        cargoProcess.stdout?.on('data', (data) => {
          buildOutput += data.toString();
        });

        cargoProcess.stderr?.on('data', (data) => {
          errorOutput += data.toString();
        });

        cargoProcess.on('close', async (code) => {
          if (code === 0) {
            try {
              // Copy the built binary to tools directory
              const binaryName = platform === 'windows' ? 'pop.exe' : 'pop';
              const sourceBinary = join(sourceDir, 'target', 'release', binaryName);
              const destBinary = join(this.toolsDir, binaryName);
              
              await fs.copyFile(sourceBinary, destBinary);
              
              // Make executable on Unix systems
              if (platform !== 'windows') {
                await fs.chmod(destBinary, 0o755);
              }

              // Clean up source directory
              await fs.rm(sourceDir, { recursive: true, force: true });

              const version = await this.getToolVersion();
              resolve({
                success: true,
                platform,
                version: version || 'unknown',
                skipped: false
              });
            } catch (copyError) {
              resolve({
                success: false,
                platform,
                error: `Build succeeded but binary copy failed: ${copyError}`,
                skipped: false
              });
            }
          } else {
            // Clean up source directory on failure
            try {
              await fs.rm(sourceDir, { recursive: true, force: true });
            } catch {
              // Ignore cleanup errors
            }

            resolve({
              success: false,
              platform,
              error: `Cargo build failed with code ${code}: ${errorOutput}`,
              skipped: false
            });
          }
        });

        // Set timeout for source build
        setTimeout(() => {
          cargoProcess.kill('SIGTERM');
          resolve({
            success: false,
            platform,
            error: `Build timeout (${timeout / 1000 / 60} minutes)`,
            skipped: false
          });
        }, timeout);
      });
    } catch (error) {
      return {
        success: false,
        platform,
        error: `Source installation error: ${error}`,
        skipped: false
      };
    }
  }

  /**
   * Strategy 2: Install from source (Git + Cargo build) - Fallback method
   */
  private async installFromSource(platform: SupportedPlatform, timeout = 20 * 60 * 1000): Promise<ToolInstallationResult> {
    try {
      const sourceDir = join(this.toolsDir, 'pop-cli-source');
      
      // Clone repository
      execSync(`git clone --depth 1 https://github.com/r0gue-io/pop-cli.git "${sourceDir}"`, {
        stdio: 'pipe',
        timeout: 60000
      });

      // Build with chain features only using release profile
      return new Promise((resolve) => {
        const args = [
          'build',
          '--release',
          '--no-default-features',
          '--features', 'chain'
        ];

        // Use full path to cargo to handle PATH issues
        const cargoPath = join(homedir(), '.cargo', 'bin', 'cargo');
        const cargoProcess = spawn(cargoPath, args, {
          stdio: 'pipe',
          cwd: sourceDir
        });

        cargoProcess.on('close', async (code) => {
          if (code === 0) {
            try {
              // Copy the built binary to tools directory
              const binaryName = platform === 'windows' ? 'pop.exe' : 'pop';
              const sourceBinary = join(sourceDir, 'target', 'release', binaryName);
              const destBinary = join(this.toolsDir, binaryName);
              
              await fs.copyFile(sourceBinary, destBinary);
              
              // Make executable on Unix systems
              if (platform !== 'windows') {
                await fs.chmod(destBinary, 0o755);
              }

              // Clean up source directory
              await fs.rm(sourceDir, { recursive: true, force: true });

              const version = await this.getToolVersion();
              resolve({
                success: true,
                platform,
                version: version || 'unknown',
                skipped: false
              });
            } catch (copyError) {
              resolve({
                success: false,
                platform,
                error: `Build succeeded but binary copy failed: ${copyError}`,
                skipped: false
              });
            }
          } else {
            // Clean up source directory on failure
            try {
              await fs.rm(sourceDir, { recursive: true, force: true });
            } catch {
              // Ignore cleanup errors
            }

            resolve({
              success: false,
              platform,
              error: `Source build failed with code ${code}`,
              skipped: false
            });
          }
        });

        // Set timeout for source build
        setTimeout(() => {
          cargoProcess.kill('SIGTERM');
          resolve({
            success: false,
            platform,
            error: `Source build timeout (${timeout / 1000 / 60} minutes)`,
            skipped: false
          });
        }, timeout);
      });
    } catch (error) {
      return {
        success: false,
        platform,
        error: `Source installation error: ${error}`,
        skipped: false
      };
    }
  }


  /**
   * Check if Pop-CLI is installed system-wide
   */
  private async checkSystemInstallation(): Promise<boolean> {
    try {
      execSync('pop --version', { stdio: 'pipe', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if protoc (Protocol Buffers compiler) is installed
   */
  private async checkProtocInstallation(): Promise<boolean> {
    try {
      execSync('protoc --version', { stdio: 'pipe', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get platform-specific protoc installation command
   */
  private getProtocInstallCommand(platform: SupportedPlatform): string {
    switch (platform) {
      case 'linux':
      case 'wsl':
        return 'sudo apt-get install protobuf-compiler (Ubuntu/Debian) or equivalent';
      case 'macos':
        return 'brew install protobuf';
      case 'windows':
        return 'Install from https://github.com/protocolbuffers/protobuf/releases';
      default:
        return 'Install protobuf compiler for your platform';
    }
  }

  /**
   * Check if Pop-CLI is installed in our tools directory
   */
  private async checkToolsDirectoryInstallation(): Promise<boolean> {
    try {
      const binaryName = platform() === 'win32' ? 'pop.exe' : 'pop';
      const binaryPaths = [
        join(this.toolsDir, binaryName),
        join(this.toolsDir, 'bin', binaryName)
      ];

      for (const binaryPath of binaryPaths) {
        try {
          await fs.access(binaryPath);
          // Try to execute it
          execSync(`"${binaryPath}" --version`, { stdio: 'pipe', timeout: 3000 });
          return true;
        } catch {
          continue;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Ensure tools directory exists
   */
  private async ensureToolsDirectory(): Promise<void> {
    await fs.mkdir(this.toolsDir, { recursive: true });
  }

  /**
   * Update PATH for current session
   */
  private async updatePath(): Promise<void> {
    // Add tools directory to PATH for current session
    const currentPath = process.env.PATH || '';
    const binDir = join(this.toolsDir, 'bin');
    
    if (!currentPath.includes(this.toolsDir)) {
      process.env.PATH = `${this.toolsDir}${platform() === 'win32' ? ';' : ':'}${binDir}${platform() === 'win32' ? ';' : ':'}${currentPath}`;
    }
  }

  /**
   * Get installation time estimate
   */
  public getInstallationTimeEstimate(platform: SupportedPlatform): string {
    switch (platform) {
      case 'linux':
      case 'wsl':
      case 'macos':
        return '15-25 minutes (requires Rust + protoc)';
      case 'windows':
        return '20-30 minutes (requires Rust + protoc)';
      default:
        return '15-30 minutes (requires dependencies)';
    }
  }

  /**
   * Get troubleshooting guidance for installation failures
   */
  public getTroubleshootingGuidance(platform: SupportedPlatform, error?: string): string {
    const protocInstall = this.getProtocInstallCommand(platform);
    const baseGuidance = [
      '• Ensure internet connection is available',
      '• Check that Rust toolchain is installed: rustc --version',
      '• Verify Git is available: git --version',
      `• Install Protocol Buffers compiler: ${protocInstall}`,
      '• Try manual installation: https://github.com/r0gue-io/pop-cli'
    ].join('\n');

    if (error?.includes('timeout')) {
      return `Installation timed out. ${baseGuidance}\n• Try running with faster internet connection`;
    }

    if (error?.includes('GitHub API')) {
      return `GitHub API access failed. ${baseGuidance}\n• Check GitHub.com accessibility`;
    }

    return baseGuidance;
  }

}
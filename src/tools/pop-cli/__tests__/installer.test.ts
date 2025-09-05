import { PopCliInstaller, PopCliInstallationOptions } from '../installer.js';
import { PlatformDetector, SupportedPlatform } from '../../platform-detector.js';
import { RustInstaller } from '../../rust-installer.js';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    access: jest.fn(),
    chmod: jest.fn(),
    rm: jest.fn(),
  }
}));
jest.mock('../../platform-detector.js');
jest.mock('../../rust-installer.js');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPlatformDetector = PlatformDetector as jest.MockedClass<typeof PlatformDetector>;
const mockRustInstaller = RustInstaller as jest.MockedClass<typeof RustInstaller>;

describe('PopCliInstaller', () => {
  let installer: PopCliInstaller;
  let mockPlatformDetectorInstance: jest.Mocked<PlatformDetector>;
  let mockRustInstallerInstance: jest.Mocked<RustInstaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup platform detector mock
    mockPlatformDetectorInstance = {
      detectPlatform: jest.fn(),
      getCachedPlatformInfo: jest.fn(),
      getInstallationGuidance: jest.fn()
    } as any;
    
    mockPlatformDetector.getInstance = jest.fn().mockReturnValue(mockPlatformDetectorInstance);

    // Setup rust installer mock
    mockRustInstallerInstance = {
      isToolInstalled: jest.fn(),
      getToolVersion: jest.fn(),
      installTool: jest.fn(),
      installRust: jest.fn(),
      getInstallationTimeEstimate: jest.fn(),
      getTroubleshootingGuidance: jest.fn()
    } as any;

    mockRustInstaller.mockImplementation(() => mockRustInstallerInstance);

    installer = new PopCliInstaller();
  });

  describe('isToolInstalled', () => {
    it('should return true when Pop-CLI is available in system PATH', async () => {
      mockExecSync.mockReturnValueOnce('pop 0.4.0' as any);

      const result = await installer.isToolInstalled();

      expect(result).toBe(true);
      expect(mockExecSync).toHaveBeenCalledWith('pop --version', expect.objectContaining({
        stdio: 'pipe',
        timeout: 3000
      }));
    });

    it('should check tools directory when system installation fails', async () => {
      mockExecSync
        .mockImplementationOnce(() => { throw new Error('Command not found'); }) // System check fails
        .mockReturnValueOnce('pop 0.4.0' as any); // Tools directory check succeeds
      
      mockFs.access.mockResolvedValueOnce(undefined);

      const result = await installer.isToolInstalled();

      expect(result).toBe(true);
      expect(mockExecSync).toHaveBeenCalledTimes(2);
    });

    it('should return false when Pop-CLI is not installed anywhere', async () => {
      mockExecSync.mockImplementation(() => { throw new Error('Command not found'); });
      mockFs.access.mockRejectedValue(new Error('File not found'));

      const result = await installer.isToolInstalled();

      expect(result).toBe(false);
    });
  });

  describe('getToolVersion', () => {
    it('should return version from system installation', async () => {
      mockExecSync.mockReturnValueOnce('pop 0.4.0\n');

      const version = await installer.getToolVersion();

      expect(version).toBe('pop 0.4.0');
    });

    it('should return version from tools directory', async () => {
      mockExecSync
        .mockImplementationOnce(() => { throw new Error('Command not found'); })
        .mockReturnValueOnce('pop 0.4.0\n');

      const version = await installer.getToolVersion();

      expect(version).toBe('pop 0.4.0');
    });

    it('should return null when version cannot be determined', async () => {
      mockExecSync.mockImplementation(() => { throw new Error('Command not found'); });

      const version = await installer.getToolVersion();

      expect(version).toBe(null);
    });
  });

  describe('installPopCli', () => {
    const mockPlatform: SupportedPlatform = 'linux';

    beforeEach(() => {
      mockFs.mkdir.mockResolvedValue(undefined);
    });

    it('should attempt pre-compiled binary installation first', async () => {
      const mockGitHubRelease = {
        tag_name: 'v0.4.0',
        assets: [
          { name: 'pop-linux-amd64.tar.gz', browser_download_url: 'https://example.com/binary' }
        ]
      };

      // Mock GitHub API call
      const mockHttpsGet = jest.fn().mockImplementation((options, callback) => {
        const mockResponse = {
          statusCode: 200,
          on: jest.fn().mockImplementation((event, handler) => {
            if (event === 'data') handler(JSON.stringify(mockGitHubRelease));
            if (event === 'end') handler();
          })
        };
        callback(mockResponse);
        return { on: jest.fn(), setTimeout: jest.fn(), end: jest.fn() };
      });

      // Mock successful installation
      jest.spyOn(installer as any, 'getLatestRelease').mockResolvedValue(mockGitHubRelease);
      jest.spyOn(installer as any, 'downloadFile').mockResolvedValue(undefined);
      mockFs.chmod.mockResolvedValue(undefined);
      mockExecSync.mockReturnValueOnce('pop 0.4.0');

      const result = await installer.installPopCli(mockPlatform);

      expect(result.success).toBe(true);
      expect(result.version).toBe('pop 0.4.0');
      expect(result.platform).toBe(mockPlatform);
    });

    it('should fallback to cargo install when binary installation fails', async () => {
      mockRustInstallerInstance.isToolInstalled.mockResolvedValue(true);
      
      // Mock binary installation failure
      jest.spyOn(installer as any, 'installPrecompiledBinary').mockRejectedValue(new Error('Binary failed'));
      
      // Mock successful cargo installation
      const mockSpawn = jest.fn().mockReturnValue({
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') callback(0); // Success exit code
        }),
        kill: jest.fn()
      });
      
      jest.spyOn(require('child_process'), 'spawn').mockImplementation(mockSpawn);
      mockExecSync.mockReturnValueOnce('pop 0.4.0');

      const result = await installer.installPopCli(mockPlatform);

      expect(mockSpawn).toHaveBeenCalledWith('cargo', expect.arrayContaining([
        'install',
        'pop-cli',
        '--no-default-features',
        '--features', 'chain'
      ]), expect.any(Object));
    });

    it('should fallback to source compilation when cargo install fails', async () => {
      mockRustInstallerInstance.isToolInstalled.mockResolvedValue(true);
      
      // Mock previous strategies failing
      jest.spyOn(installer as any, 'installPrecompiledBinary').mockRejectedValue(new Error('Binary failed'));
      jest.spyOn(installer as any, 'installViaCargo').mockResolvedValue({ success: false });
      
      // Mock successful source compilation
      mockExecSync.mockReturnValueOnce(undefined as any); // git clone
      const mockSpawn = jest.fn().mockReturnValue({
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') callback(0); // Success exit code
        }),
        kill: jest.fn()
      });
      
      jest.spyOn(require('child_process'), 'spawn').mockImplementation(mockSpawn);
      mockFs.rm.mockResolvedValue(undefined);
      mockExecSync.mockReturnValueOnce('pop 0.4.0'); // version check

      const result = await installer.installPopCli(mockPlatform);

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('git clone --depth 1'),
        expect.any(Object)
      );
    });

    it('should return failure when all strategies fail', async () => {
      mockRustInstallerInstance.isToolInstalled.mockResolvedValue(false);
      
      // Mock all strategies failing
      jest.spyOn(installer as any, 'installPrecompiledBinary').mockRejectedValue(new Error('Binary failed'));

      const result = await installer.installPopCli(mockPlatform);

      expect(result.success).toBe(false);
      expect(result.error).toContain('All installation strategies failed');
    });

    it('should respect skipPreCompiled option', async () => {
      const options: PopCliInstallationOptions = { skipPreCompiled: true };
      mockRustInstallerInstance.isToolInstalled.mockResolvedValue(true);

      const binaryInstallSpy = jest.spyOn(installer as any, 'installPrecompiledBinary');
      const cargoInstallSpy = jest.spyOn(installer as any, 'installViaCargo').mockResolvedValue({ success: true });

      await installer.installPopCli(mockPlatform, options);

      expect(binaryInstallSpy).not.toHaveBeenCalled();
      expect(cargoInstallSpy).toHaveBeenCalled();
    });

    it('should respect forceSource option', async () => {
      const options: PopCliInstallationOptions = { forceSource: true };
      mockRustInstallerInstance.isToolInstalled.mockResolvedValue(true);

      const binaryInstallSpy = jest.spyOn(installer as any, 'installPrecompiledBinary');
      const cargoInstallSpy = jest.spyOn(installer as any, 'installViaCargo');
      const sourceInstallSpy = jest.spyOn(installer as any, 'installFromSource').mockResolvedValue({ success: true });

      await installer.installPopCli(mockPlatform, options);

      expect(binaryInstallSpy).not.toHaveBeenCalled();
      expect(cargoInstallSpy).not.toHaveBeenCalled();
      expect(sourceInstallSpy).toHaveBeenCalled();
    });
  });

  describe('getBinaryName', () => {
    it('should return correct binary name for Linux x64', async () => {
      Object.defineProperty(process, 'arch', { value: 'x64' });
      
      const binaryName = (installer as any).getBinaryName('linux');
      
      expect(binaryName).toBe('pop-linux-amd64.tar.gz');
    });

    it('should return correct binary name for macOS ARM64', async () => {
      Object.defineProperty(process, 'arch', { value: 'arm64' });
      
      const binaryName = (installer as any).getBinaryName('macos');
      
      expect(binaryName).toBe('pop-macos-arm64.tar.gz');
    });

    it('should return correct binary name for Windows', async () => {
      Object.defineProperty(process, 'arch', { value: 'x64' });
      
      const binaryName = (installer as any).getBinaryName('windows');
      
      expect(binaryName).toBe('pop-windows-amd64.zip');
    });

    it('should return null for unsupported platforms', async () => {
      const binaryName = (installer as any).getBinaryName('unknown' as SupportedPlatform);
      
      expect(binaryName).toBe(null);
    });
  });

  describe('getInstallationTimeEstimate', () => {
    it('should return time estimate for Linux', () => {
      const estimate = installer.getInstallationTimeEstimate('linux');
      
      expect(estimate).toContain('2-5 minutes');
      expect(estimate).toContain('10-20 minutes');
    });

    it('should return time estimate for Windows', () => {
      const estimate = installer.getInstallationTimeEstimate('windows');
      
      expect(estimate).toContain('15-25 minutes');
    });
  });

  describe('getTroubleshootingGuidance', () => {
    it('should return basic guidance', () => {
      const guidance = installer.getTroubleshootingGuidance('linux');
      
      expect(guidance).toContain('internet connection');
      expect(guidance).toContain('Rust toolchain');
      expect(guidance).toContain('Git');
    });

    it('should include timeout-specific guidance', () => {
      const guidance = installer.getTroubleshootingGuidance('linux', 'Installation timeout');
      
      expect(guidance).toContain('timeout');
      expect(guidance).toContain('faster internet');
    });

    it('should include GitHub API-specific guidance', () => {
      const guidance = installer.getTroubleshootingGuidance('linux', 'GitHub API failed');
      
      expect(guidance).toContain('GitHub API');
      expect(guidance).toContain('GitHub.com accessibility');
    });
  });
});
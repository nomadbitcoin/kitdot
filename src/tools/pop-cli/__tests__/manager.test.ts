import { PopCliManager, PopCliCommandOptions, ChainLaunchOptions } from '../manager.js';
import { PopCliInstaller } from '../installer.js';
import { execSync, spawn } from 'child_process';
import { EventEmitter } from 'events';

// Mock dependencies
jest.mock('../installer.js');
jest.mock('child_process');

const mockPopCliInstaller = PopCliInstaller as jest.MockedClass<typeof PopCliInstaller>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

// Mock child process
class MockChildProcess extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();
  kill = jest.fn();
}

describe('PopCliManager', () => {
  let manager: PopCliManager;
  let mockInstallerInstance: jest.Mocked<PopCliInstaller>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup installer mock
    mockInstallerInstance = {
      isToolInstalled: jest.fn(),
      getToolVersion: jest.fn(),
      installTool: jest.fn(),
      installPopCli: jest.fn(),
      getInstallationTimeEstimate: jest.fn(),
      getTroubleshootingGuidance: jest.fn()
    } as any;

    mockPopCliInstaller.mockImplementation(() => mockInstallerInstance);

    manager = new PopCliManager();
  });

  describe('checkInstallation', () => {
    it('should return true when Pop-CLI is installed', async () => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);

      const result = await manager.checkInstallation();

      expect(result).toBe(true);
      expect(mockInstallerInstance.isToolInstalled).toHaveBeenCalled();
    });

    it('should return false when Pop-CLI is not installed', async () => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(false);

      const result = await manager.checkInstallation();

      expect(result).toBe(false);
    });

    it('should return false when check throws an error', async () => {
      mockInstallerInstance.isToolInstalled.mockRejectedValue(new Error('Check failed'));

      const result = await manager.checkInstallation();

      expect(result).toBe(false);
    });
  });

  describe('getVersion', () => {
    it('should return version when available', async () => {
      mockInstallerInstance.getToolVersion.mockResolvedValue('pop 0.4.0');

      const version = await manager.getVersion();

      expect(version).toBe('pop 0.4.0');
    });

    it('should return null when version is not available', async () => {
      mockInstallerInstance.getToolVersion.mockResolvedValue(null);

      const version = await manager.getVersion();

      expect(version).toBe(null);
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any); // For binary path check
    });

    it('should return error when Pop-CLI is not installed', async () => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(false);

      const result = await manager.execute('--version');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not installed');
    });

    it('should execute command successfully', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.execute('--version');

      // Simulate command output
      mockChildProcess.stdout.emit('data', 'pop 0.4.0\n');
      mockChildProcess.emit('close', 0);

      const result = await executePromise;

      expect(result.success).toBe(true);
      expect(result.output).toBe('pop 0.4.0');
      expect(result.exitCode).toBe(0);
    });

    it('should handle command failure', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.execute('invalid-command');

      // Simulate command failure
      mockChildProcess.stderr.emit('data', 'Command not found\n');
      mockChildProcess.emit('close', 1);

      const result = await executePromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('Command not found');
      expect(result.exitCode).toBe(1);
    });

    it('should add skip-confirm flag when requested', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.execute('up chain', { skipConfirm: true });

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--skip-confirm']),
        expect.any(Object)
      );
    });

    it('should include custom args', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const options: PopCliCommandOptions = {
        args: ['--custom-arg', 'value']
      };

      const executePromise = manager.execute('up chain', options);

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--custom-arg', 'value']),
        expect.any(Object)
      );
    });

    it('should handle command timeout', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.execute('long-running-command', { timeout: 1000 });

      // Don't complete the command, let it timeout
      const result = await executePromise;

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
      expect(mockChildProcess.kill).toHaveBeenCalledWith('SIGTERM');
    });
  });

  describe('launchChain', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any);
    });

    it('should launch development chain with default options', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.launchChain();

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--dev']),
        expect.any(Object)
      );
    });

    it('should launch local chain', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const options: ChainLaunchOptions = { chainType: 'local' };
      const executePromise = manager.launchChain(options);

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--local']),
        expect.any(Object)
      );
    });

    it('should launch testnet chain', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const options: ChainLaunchOptions = { chainType: 'testnet' };
      const executePromise = manager.launchChain(options);

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--testnet']),
        expect.any(Object)
      );
    });

    it('should include custom arguments', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const options: ChainLaunchOptions = {
        chainType: 'development',
        customArgs: ['--port', '9944']
      };
      const executePromise = manager.launchChain(options);

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['up', 'chain', '--dev', '--port', '9944']),
        expect.any(Object)
      );
    });
  });

  describe('stopChain', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any);
    });

    it('should stop chain with skip confirm', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.stopChain();

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['down', 'chain', '--skip-confirm']),
        expect.any(Object)
      );
    });
  });

  describe('createParachain', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any);
    });

    it('should create parachain project', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.createParachain('my-parachain');

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['new', 'parachain', 'my-parachain', '--skip-confirm']),
        expect.any(Object)
      );
    });

    it('should return error for empty project name', async () => {
      const result = await manager.createParachain('');

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should trim project name whitespace', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const executePromise = manager.createParachain('  my-parachain  ');

      // Complete the command
      mockChildProcess.emit('close', 0);
      await executePromise;

      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        expect.arrayContaining(['new', 'parachain', 'my-parachain']),
        expect.any(Object)
      );
    });
  });

  describe('executeBackground', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any);
    });

    it('should spawn background process', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const childProcess = await manager.executeBackground('up chain');

      expect(childProcess).toBe(mockChildProcess);
      expect(mockSpawn).toHaveBeenCalledWith(
        'pop',
        ['up', 'chain'],
        expect.objectContaining({
          stdio: 'pipe',
          detached: false
        })
      );
    });

    it('should throw error when Pop-CLI is not installed', async () => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(false);

      await expect(manager.executeBackground('up chain')).rejects.toThrow('not installed');
    });
  });

  describe('validateChainFeatures', () => {
    beforeEach(() => {
      mockInstallerInstance.isToolInstalled.mockResolvedValue(true);
      mockExecSync.mockReturnValue('pop 0.4.0' as any);
    });

    it('should return true when chain features are available', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const validatePromise = manager.validateChainFeatures();

      // Simulate help output with chain command
      mockChildProcess.stdout.emit('data', 'Available commands:\n  up chain  Start a chain\n');
      mockChildProcess.emit('close', 0);

      const result = await validatePromise;

      expect(result).toBe(true);
    });

    it('should return false when chain features are not available', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const validatePromise = manager.validateChainFeatures();

      // Simulate help output without chain command
      mockChildProcess.stdout.emit('data', 'Available commands:\n  new  Create new project\n');
      mockChildProcess.emit('close', 0);

      const result = await validatePromise;

      expect(result).toBe(false);
    });

    it('should return false when command fails', async () => {
      const mockChildProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockChildProcess as any);

      const validatePromise = manager.validateChainFeatures();

      // Simulate command failure
      mockChildProcess.emit('close', 1);

      const result = await validatePromise;

      expect(result).toBe(false);
    });
  });
});
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { PlatformDetector } from '../tools/platform-detector.js';
import { RustInstaller } from '../tools/rust-installer.js';
import { PopCliInstaller } from '../tools/pop-cli/installer.js';
import { PopCliManager } from '../tools/pop-cli/manager.js';

export async function toolsCommand(subcommand?: string) {
  if (!subcommand) {
    await displayToolsHelp();
    return;
  }

  switch (subcommand) {
    case 'install-rust':
      await installRustCommand();
      break;
    case 'install-pop-cli':
      await installPopCliCommand();
      break;
    case 'check':
      await checkToolsCommand();
      break;
    default:
      console.log(chalk.red(`❌ Unknown tools subcommand: ${subcommand}`));
      await displayToolsHelp();
      break;
  }
}

async function displayToolsHelp() {
  console.log(chalk.blue('\n🔧 Kit-Dot Tools Management\n'));
  console.log('Available commands:');
  console.log(chalk.green('  kit-dot tools install-rust') + '    - Install Rust toolchain for blockchain development');
  console.log(chalk.green('  kit-dot tools install-pop-cli') + ' - Install Pop-CLI for blockchain node management');
  console.log(chalk.green('  kit-dot tools check') + '           - Check status of development tools');
  console.log(chalk.green('  kit-dot tools') + '               - Show this help message');
  console.log('\nFor more information: https://kit-dot.dev/docs/tools\n');
}

async function installRustCommand() {
  const platformDetector = PlatformDetector.getInstance();
  const rustInstaller = new RustInstaller();

  // Check if Rust is already installed
  const isRustInstalled = await rustInstaller.isToolInstalled();
  
  if (isRustInstalled) {
    const version = await rustInstaller.getToolVersion();
    console.log(chalk.green(`✅ Rust toolchain already installed: ${version}`));
    return;
  }

  // Detect platform first
  const platformInfo = await platformDetector.detectPlatform();
  console.log(chalk.blue(`🖥️  Platform detected: ${platformInfo.platform} (${platformInfo.architecture})`));

  if (!platformInfo.isSupported) {
    console.log(chalk.yellow('⚠️  Automatic Rust installation not supported for your platform.'));
    console.log(chalk.blue(platformDetector.getInstallationGuidance(platformInfo.platform)));
    return;
  }

  // Single consent prompt with all necessary information
  const timeEstimate = rustInstaller.getInstallationTimeEstimate(platformInfo.platform);
  const rustConsentQuestion = {
    type: 'confirm' as const,
    name: 'installRust',
    message: `🦀 Install Rust toolchain for blockchain development? (Est. time: ${timeEstimate})`,
    default: true
  };

  const rustAnswer = await inquirer.prompt([rustConsentQuestion]);

  if (!rustAnswer.installRust) {
    console.log(chalk.yellow('⚠️  Rust installation cancelled.'));
    console.log(chalk.blue('💡 You can install Rust manually by visiting: https://rustup.rs/'));
    return;
  }

  // Proceed with installation
  const spinner = ora('Installing Rust toolchain for blockchain development...').start();
  
  try {
    const installResult = await rustInstaller.installRust(platformInfo.platform);
    
    if (installResult.success) {
      if (installResult.skipped) {
        spinner.succeed(`Rust toolchain ready: ${installResult.version}`);
      } else {
        spinner.succeed(`Rust toolchain installed successfully: ${installResult.version}`);
      }
    } else {
      spinner.fail('Rust installation failed');
      console.log(chalk.yellow('⚠️  ' + installResult.error));
      console.log(chalk.blue(rustInstaller.getTroubleshootingGuidance(installResult.platform, installResult.error)));
    }
  } catch (error) {
    spinner.fail('Rust installation failed');
    console.log(chalk.red('❌ Unexpected error during Rust installation:', error));
  }
}

async function installPopCliCommand() {
  const platformDetector = PlatformDetector.getInstance();
  const popCliInstaller = new PopCliInstaller();
  const popCliManager = new PopCliManager();

  // Check if Pop-CLI is already installed
  const isPopCliInstalled = await popCliManager.checkInstallation();
  
  if (isPopCliInstalled) {
    const version = await popCliManager.getVersion();
    console.log(chalk.green(`✅ Pop-CLI already installed: ${version}`));
    
    // Validate chain features
    const hasChainFeatures = await popCliManager.validateChainFeatures();
    if (hasChainFeatures) {
      console.log(chalk.green('✅ Chain features are available'));
    } else {
      console.log(chalk.yellow('⚠️  Chain features not detected - may need reinstallation'));
    }
    return;
  }

  // Detect platform first
  const platformInfo = await platformDetector.detectPlatform();
  console.log(chalk.blue(`🖥️  Platform detected: ${platformInfo.platform} (${platformInfo.architecture})`));

  if (!platformInfo.isSupported) {
    console.log(chalk.yellow('⚠️  Automatic Pop-CLI installation not supported for your platform.'));
    console.log(chalk.blue('💡 Please install Pop-CLI manually: https://github.com/r0gue-io/pop-cli'));
    return;
  }

  // Single consent prompt with installation information
  const timeEstimate = popCliInstaller.getInstallationTimeEstimate(platformInfo.platform);
  const popCliConsentQuestion = {
    type: 'confirm' as const,
    name: 'installPopCli',
    message: `⚙️  Install Pop-CLI for blockchain node management? (Est. time: ${timeEstimate})`,
    default: true
  };

  const popCliAnswer = await inquirer.prompt([popCliConsentQuestion]);

  if (!popCliAnswer.installPopCli) {
    console.log(chalk.yellow('⚠️  Pop-CLI installation cancelled.'));
    console.log(chalk.blue('💡 You can install Pop-CLI manually: https://github.com/r0gue-io/pop-cli'));
    return;
  }

  // Proceed with installation
  const spinner = ora('Installing Pop-CLI for blockchain node management...').start();
  
  try {
    const installResult = await popCliInstaller.installPopCli(platformInfo.platform);
    
    if (installResult.success) {
      if (installResult.skipped) {
        spinner.succeed(`Pop-CLI ready: ${installResult.version}`);
      } else {
        spinner.succeed(`Pop-CLI installed successfully: ${installResult.version}`);
      }
      
      // Validate chain features
      const hasChainFeatures = await popCliManager.validateChainFeatures();
      if (hasChainFeatures) {
        console.log(chalk.green('✅ Chain features verified and available'));
        console.log(chalk.blue('💡 You can now launch blockchain nodes with: pop up chain'));
      } else {
        console.log(chalk.yellow('⚠️  Chain features not detected - installation may be incomplete'));
      }
    } else {
      spinner.fail('Pop-CLI installation failed');
      console.log(chalk.yellow('⚠️  ' + installResult.error));
      console.log(chalk.blue(popCliInstaller.getTroubleshootingGuidance(installResult.platform, installResult.error)));
    }
  } catch (error) {
    spinner.fail('Pop-CLI installation failed');
    console.log(chalk.red('❌ Unexpected error during Pop-CLI installation:', error));
  }
}

async function checkToolsCommand() {
  console.log(chalk.blue('\n🔍 Checking development tools...\n'));
  
  const platformDetector = PlatformDetector.getInstance();
  const rustInstaller = new RustInstaller();
  const popCliManager = new PopCliManager();

  // Platform detection
  const platformInfo = await platformDetector.detectPlatform();
  console.log(chalk.blue(`🖥️  Platform: ${platformInfo.platform} (${platformInfo.architecture})`));
  console.log(chalk.blue(`📦 Platform supported: ${platformInfo.isSupported ? 'Yes' : 'No'}`));
  
  // Rust status
  const isRustInstalled = await rustInstaller.isToolInstalled();
  if (isRustInstalled) {
    const version = await rustInstaller.getToolVersion();
    console.log(chalk.green(`🦀 Rust: Installed (${version})`));
  } else {
    console.log(chalk.yellow('🦀 Rust: Not installed'));
    console.log(chalk.gray('   Run: kit-dot tools install-rust'));
  }

  // Pop-CLI status
  const isPopCliInstalled = await popCliManager.checkInstallation();
  if (isPopCliInstalled) {
    const version = await popCliManager.getVersion();
    console.log(chalk.green(`⚙️  Pop-CLI: Installed (${version})`));
    
    // Check chain features
    const hasChainFeatures = await popCliManager.validateChainFeatures();
    if (hasChainFeatures) {
      console.log(chalk.green('   ✅ Chain features available'));
    } else {
      console.log(chalk.yellow('   ⚠️  Chain features not detected'));
    }
  } else {
    console.log(chalk.yellow('⚙️  Pop-CLI: Not installed'));
    console.log(chalk.gray('   Run: kit-dot tools install-pop-cli'));
  }

  console.log();
}
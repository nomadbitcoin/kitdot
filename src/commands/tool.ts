import chalk from "chalk";
import { PopCliManager } from "../tools/pop-cli/manager.js";

export async function toolCommand(tool: string, commands: string[], options?: any) {
  if (tool !== 'pop-cli') {
    console.log(chalk.red(`❌ Unknown tool: ${tool}`));
    console.log(chalk.blue('Available tools: pop-cli'));
    return;
  }

  await executePopCliCommand(commands, options);
}

async function executePopCliCommand(commands: string[], options?: any) {
  const popCliManager = new PopCliManager();

  // Check if Pop-CLI is installed
  const isInstalled = await popCliManager.checkInstallation();
  if (!isInstalled) {
    console.log(chalk.red('❌ Pop-CLI is not installed.'));
    console.log(chalk.blue('💡 Install it first with: kit-dot tools install-pop-cli'));
    return;
  }

  // If no commands provided, show help
  if (!commands || commands.length === 0) {
    console.log(chalk.blue('📋 Pop-CLI Help:'));
    const helpResult = await popCliManager.getHelp();
    if (helpResult.success && helpResult.output) {
      console.log(helpResult.output);
    } else {
      console.log(chalk.red('❌ Failed to get Pop-CLI help'));
      if (helpResult.error) {
        console.log(chalk.gray(helpResult.error));
      }
    }
    return;
  }

  // Join all commands into a single command string
  let commandString = commands.join(' ');
  
  // Add any passed-through options from Commander.js
  if (options && options.unknownOptions) {
    commandString += ' ' + options.unknownOptions.join(' ');
  }
  
  console.log(chalk.blue(`🔧 Executing: pop ${commandString}`));
  
  try {
    const result = await popCliManager.execute(commandString, {
      timeout: 300000 // 5 minutes timeout for potentially long operations
    });

    if (result.success) {
      if (result.output) {
        console.log(result.output);
      }
      console.log(chalk.green('✅ Command completed successfully'));
    } else {
      console.log(chalk.red('❌ Command failed'));
      if (result.error) {
        console.log(chalk.red(result.error));
      }
      if (result.exitCode !== undefined) {
        process.exit(result.exitCode);
      }
    }
  } catch (error) {
    console.log(chalk.red(`❌ Unexpected error: ${error}`));
    process.exit(1);
  }
}
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { ProjectConfig, ProjectType, ProjectFeatures, TemplateConfig } from '../types.js';
import { createProjectStructure } from '../utils/project-structure.js';
import { setupContracts } from '../utils/setup-contracts.js';
import { setupFrontend } from '../utils/setup-frontend.js';
import { setupCloudFunctions } from '../utils/setup-cloud-functions.js';
import { setupDocumentation } from '../utils/setup-docs.js';
import { getTemplatesByCategory, getAllTemplates, getTemplate } from '../templates/registry.js';

export async function initCommand(projectName?: string, options?: { dir?: string }) {
  console.log(chalk.blue.bold('🚀 Welcome to kit-dot - Polkadot Dapp Toolkit'));
  console.log(chalk.gray('This tool will help you set up a project to build Dapps on Polkadot Cloud\n'));

  try {
    const config = await gatherProjectInfo(projectName, options?.dir);
    await createProject(config);
    displaySuccessMessage(config);
  } catch (error) {
    console.error(chalk.red('❌ Error creating project:'), error);
    process.exit(1);
  }
}

async function gatherProjectInfo(projectName?: string, targetDir?: string): Promise<ProjectConfig> {
  const questions: any[] = [];

  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-polkadot-dapp',
      validate: (input: string) => {
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      }
    });
  }

  questions.push({
    type: 'list',
    name: 'projectType',
    message: 'What type of project do you want to create?',
    choices: [
      {
        name: '🌟 Full-stack Dapp (Frontend + Smart Contracts + Cloud Functions)',
        value: 'fullstack'
      },
      {
        name: '🎨 Frontend only (React app for Polkadot)',
        value: 'frontend'
      },
      {
        name: '⚙️  Backend only (Smart Contracts + Cloud Functions)',
        value: 'backend'
      }
    ]
  });

  const answers = await inquirer.prompt(questions);

  const name = projectName || answers.projectName;
  const type = answers.projectType as ProjectType;
  const directory = targetDir || path.join(process.cwd(), name);

  const features: ProjectFeatures = {
    contracts: type === 'fullstack' || type === 'backend',
    frontend: type === 'fullstack' || type === 'frontend',
    cloudFunctions: type === 'fullstack' || type === 'backend',
    documentation: true
  };

  // Template selection for frontend projects
  let template: TemplateConfig | undefined;
  
  if (features.frontend) {
    const availableTemplates = type === 'frontend' 
      ? getTemplatesByCategory('frontend').concat(getTemplatesByCategory('fullstack'))
      : getTemplatesByCategory('fullstack');

    if (availableTemplates.length > 1) {
      const templateQuestion = {
        type: 'list' as const,
        name: 'selectedTemplate',
        message: 'Choose a frontend template:',
        choices: availableTemplates.map(template => ({
          name: `${template.framework} - ${template.description}`,
          value: template.key
        }))
      };

      const templateAnswer = await inquirer.prompt(templateQuestion);
      
      template = {
        name: templateAnswer.selectedTemplate,
        source: availableTemplates.find(t => t.key === templateAnswer.selectedTemplate)!.source
      };
    } else if (availableTemplates.length === 1) {
      // Use the only available template
      template = {
        name: availableTemplates[0].key,
        source: availableTemplates[0].source
      };
    }
  }

  return {
    name,
    type,
    directory,
    features,
    template
  };
}

async function createProject(config: ProjectConfig) {
  const spinner = ora('Creating project structure...').start();

  try {
    await createProjectStructure(config);
    spinner.succeed('Project structure created');

    if (config.features.contracts) {
      spinner.start('Setting up smart contracts...');
      await setupContracts(config);
      spinner.succeed('Smart contracts setup complete');
    }

    if (config.features.frontend) {
      spinner.start('Setting up frontend...');
      await setupFrontend(config);
      spinner.succeed('Frontend setup complete');
    }

    if (config.features.cloudFunctions) {
      spinner.start('Setting up cloud functions...');
      await setupCloudFunctions(config);
      spinner.succeed('Cloud functions setup complete');
    }

    if (config.features.documentation) {
      spinner.start('Setting up documentation...');
      await setupDocumentation(config);
      spinner.succeed('Documentation setup complete');
    }

    spinner.succeed('🎉 Project created successfully!');
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

function displaySuccessMessage(config: ProjectConfig) {
  console.log('\n' + chalk.green.bold('✅ Your Polkadot Dapp project is ready!'));
  console.log('\n📁 Project structure:');
  
  if (config.features.contracts) {
    console.log(chalk.blue('  contracts/develop/') + ' - Smart contract development (Foundry)');
    console.log(chalk.blue('  contracts/deploy/') + ' - Smart contract deployment (Hardhat)');
  }
  
  if (config.features.frontend) {
    console.log(chalk.blue('  front/') + ' - Frontend application');
  }
  
  if (config.features.cloudFunctions) {
    console.log(chalk.blue('  cloud-functions/') + ' - Cloud function implementations');
  }
  
  if (config.features.documentation) {
    console.log(chalk.blue('  docs/') + ' - Project documentation (mdbook)');
  }

  console.log('\n🚀 Next steps:');
  console.log(chalk.yellow(`  cd ${config.name}`));
  
  if (config.features.frontend) {
    console.log(chalk.yellow('  cd front && npm install && npm run dev'));
  }
  
  if (config.features.contracts) {
    console.log(chalk.yellow('  cd contracts/develop && forge build'));
  }

  // Show template documentation if available
  if (config.template) {
    const template = getTemplate(config.template.name);
    if (template?.documentationUrl) {
      console.log('\n📚 Template Documentation:');
      console.log(chalk.cyan(`  ${template.documentationUrl}`));
      console.log(chalk.gray('  ↳ Complete guide and examples for this template'));
    }
  }

  console.log('\n📖 For more information, check the documentation in the docs/ folder');
}
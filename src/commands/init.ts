import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { ProjectConfig, ProjectType, ProjectFeatures, TemplateConfig } from '../types.js';
import { createProjectStructure } from '../utils/project-structure.js';
import { setupContracts } from '../utils/setup-contracts.js';
import { setupFrontend } from '../utils/setup-frontend.js';
import { setupDocumentation } from '../utils/setup-docs.js';
import { getTemplatesByCategory, getTemplate } from '../templates/registry.js';
import { displayHomeScreen } from '../utils/homeScreen.js';

export async function initCommand(projectName?: string, options?: { dir?: string }) {
  // Display the new styled home screen
  displayHomeScreen();

  try {
    const config = await gatherProjectInfo(projectName, options?.dir);
    await createProject(config);
    // Template displays its own next steps - no additional CLI messages needed
  } catch (error) {
    console.error(chalk.red('❌ Error creating project:'), error);
    process.exit(1);
  }
}

async function gatherProjectInfo(projectName?: string, targetDir?: string): Promise<ProjectConfig> {
  // First, ask about using default template
  const defaultTemplateQuestion = {
    type: 'confirm' as const,
    name: 'useDefault',
    message: 'Install default template [Y/n]?',
    default: true
  };

  const defaultAnswer = await inquirer.prompt([defaultTemplateQuestion]);

  // Get project name if not provided
  let name: string;
  if (!projectName) {
    const nameQuestion = {
      type: 'input' as const,
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-polkadot-dapp',
      validate: (input: string) => {
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      }
    };

    const nameAnswer = await inquirer.prompt([nameQuestion]);
    name = nameAnswer.projectName;
  } else {
    name = projectName;
  }

  const directory = targetDir || path.join(process.cwd(), name);

  // If user wants default template, use local templates/default
  if (defaultAnswer.useDefault) {
    const template: TemplateConfig = {
      name: 'default',
      source: {
        type: 'local',
        localPath: 'templates/default'
      }
    };

    const features: ProjectFeatures = {
      contracts: true,
      frontend: true,
      documentation: true
    };

    return {
      name,
      type: 'fullstack',
      directory,
      features,
      template,
      installRustTools: false
    };
  }

  // If user wants non-default, proceed with existing flow
  const baseQuestions = [
    {
      type: 'list' as const,
      name: 'projectType',
      message: 'What type of project do you want to create?',
      choices: [
        {
          name: '🌟 Full-stack Dapp (Frontend + Smart Contracts)',
          value: 'fullstack'
        },
        {
          name: '🎨 Frontend only (React app for Polkadot)',
          value: 'frontend'
        },
        {
          name: '⚙️  Backend only (Smart Contracts only)',
          value: 'backend'
        }
      ]
    }
  ];

  const answers = await inquirer.prompt(baseQuestions);
  const type = (answers.projectType || 'fullstack') as ProjectType;

  // Template selection for non-default flow
  let template: TemplateConfig | undefined;

  if (type === 'fullstack' || type === 'frontend') {
    let availableTemplates;
    let messageText;

    if (type === 'frontend') {
      // Frontend-only: Show only frontend templates
      availableTemplates = getTemplatesByCategory('frontend');
      messageText = 'Choose a frontend template:';
    } else if (type === 'fullstack') {
      // Full-stack: Show frontend templates, contracts will be added automatically
      availableTemplates = getTemplatesByCategory('frontend').concat(getTemplatesByCategory('fullstack'));
      messageText = 'Choose a frontend template (Hardhat contracts will be added automatically):';
    } else {
      // Should not reach here for frontend projects, but fallback to fullstack templates
      availableTemplates = getTemplatesByCategory('fullstack');
      messageText = 'Choose a template:';
    }

    if (availableTemplates.length > 1) {
      const templateQuestion = {
        type: 'list' as const,
        name: 'selectedTemplate',
        message: messageText,
        choices: availableTemplates.map(template => ({
          name: `${template.framework} - ${template.description}`,
          value: template.key
        }))
      };

      const templateAnswer = await inquirer.prompt([templateQuestion]);

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

  // Determine features based on template category and user selection
  const selectedTemplate = template ? getTemplate(template.name) : null;
  const templateCategory = selectedTemplate?.category;

  const features: ProjectFeatures = {
    contracts: determineNeedsContracts(type, templateCategory),
    frontend: type === 'fullstack' || type === 'frontend',
    documentation: determineNeedsDocumentation(type, templateCategory)
  };

  return {
    name,
    type,
    directory,
    features,
    template,
    installRustTools: false
  };
}

function determineNeedsContracts(projectType: ProjectType, templateCategory?: string): boolean {
  // Backend projects always need contracts
  if (projectType === 'backend') return true;
  
  // Frontend projects never need separate contracts
  if (projectType === 'frontend') return false;
  
  // Fullstack projects:
  // - If template is 'fullstack', it already contains contracts - don't create separate
  // - If template is 'frontend', we need to add contracts separately
  if (projectType === 'fullstack') {
    return templateCategory !== 'fullstack';
  }
  
  return false;
}

function determineNeedsDocumentation(projectType: ProjectType, _templateCategory?: string): boolean {
  // Frontend-only projects don't need docs
  if (projectType === 'frontend') return false;
  
  // For fullstack projects:
  // - If template is 'fullstack', it might already contain docs - but we can add them anyway
  // - If template is 'frontend', we definitely need to add docs
  return true;
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
      // Don't use spinner for frontend setup - it has interactive prompts
      console.log(chalk.blue('🎨 Setting up frontend...'));
      await setupFrontend(config);
      console.log(chalk.green('✅ Frontend setup complete'));
    }

    if (config.features.documentation) {
      spinner.start('Setting up documentation...');
      await setupDocumentation(config);
      spinner.succeed('Documentation setup complete');
    }


    // Project creation completed - template will display its own next steps
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
  
  // Ensure clean exit
  process.nextTick(() => {
    // Allow any pending operations to complete before exit
  });
}
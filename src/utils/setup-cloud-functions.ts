import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';

export async function setupCloudFunctions(config: ProjectConfig): Promise<void> {
  const cloudFunctionsDir = path.join(config.directory, 'cloud-functions');
  
  await createCloudFunctionsPackageJson(cloudFunctionsDir, config);
  await createCloudFunctionsStructure(cloudFunctionsDir);
  await createExampleFunctions(cloudFunctionsDir);
  await createCloudFunctionsConfig(cloudFunctionsDir);
}

async function createCloudFunctionsPackageJson(cloudFunctionsDir: string, config: ProjectConfig): Promise<void> {
  const packageJson = {
    name: `${config.name}-cloud-functions`,
    version: '0.1.0',
    description: 'Cloud functions for Polkadot Dapp',
    type: 'module',
    scripts: {
      build: 'tsc',
      dev: 'tsc --watch',
      start: 'node dist/index.js',
      deploy: 'npm run build && serverless deploy',
      'deploy:dev': 'npm run build && serverless deploy --stage dev',
      'deploy:prod': 'npm run build && serverless deploy --stage prod',
      lint: 'eslint src/**/*.ts',
      'lint:fix': 'eslint src/**/*.ts --fix',
      test: 'jest'
    },
    dependencies: {
      '@aws-sdk/client-lambda': '^3.654.0',
      '@aws-sdk/client-dynamodb': '^3.654.0',
      'aws-lambda': '^1.0.7',
      cors: '^2.8.5',
      express: '^4.21.1'
    },
    devDependencies: {
      '@types/aws-lambda': '^8.10.145',
      '@types/cors': '^2.8.17',
      '@types/express': '^5.0.0',
      '@types/jest': '^29.5.14',
      '@types/node': '^22.16.2',
      '@typescript-eslint/eslint-plugin': '^8.12.2',
      '@typescript-eslint/parser': '^8.12.2',
      eslint: '^9.14.0',
      jest: '^29.7.0',
      'serverless': '^4.4.3',
      'serverless-offline': '^14.0.0',
      'ts-jest': '^29.2.5',
      typescript: '^5.6.2'
    }
  };

  await fs.writeJson(
    path.join(cloudFunctionsDir, 'package.json'), 
    packageJson, 
    { spaces: 2 }
  );
}

async function createCloudFunctionsStructure(cloudFunctionsDir: string): Promise<void> {
  await fs.ensureDir(path.join(cloudFunctionsDir, 'src/handlers'));
  await fs.ensureDir(path.join(cloudFunctionsDir, 'src/services'));
  await fs.ensureDir(path.join(cloudFunctionsDir, 'src/utils'));
  await fs.ensureDir(path.join(cloudFunctionsDir, 'src/types'));
  await fs.ensureDir(path.join(cloudFunctionsDir, 'tests'));

  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      outDir: 'dist',
      rootDir: 'src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.ts']
  };

  await fs.writeJson(
    path.join(cloudFunctionsDir, 'tsconfig.json'), 
    tsConfig, 
    { spaces: 2 }
  );
}

async function createExampleFunctions(cloudFunctionsDir: string): Promise<void> {
  const apiHandlerContent = `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders } from '../utils/cors.js';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, body } = event;
    
    console.log(\`\${httpMethod} \${path}\`);
    
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }

    if (httpMethod === 'GET' && path === '/health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'polkadot-dapp-api'
        }),
      };
    }

    if (httpMethod === 'POST' && path === '/api/data') {
      const requestBody = body ? JSON.parse(body) : {};
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Data processed successfully',
          data: requestBody,
          timestamp: new Date().toISOString()
        }),
      };
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'src/handlers/api.ts'), 
    apiHandlerContent
  );

  const contractHandlerContent = `import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders } from '../utils/cors.js';
import { ContractService } from '../services/contract.js';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, body } = event;
    const contractService = new ContractService();
    
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }

    if (httpMethod === 'GET' && path === '/contract/status') {
      const status = await contractService.getContractStatus();
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(status),
      };
    }

    if (httpMethod === 'POST' && path === '/contract/interact') {
      const requestBody = body ? JSON.parse(body) : {};
      const result = await contractService.interactWithContract(requestBody);
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  } catch (error) {
    console.error('Contract handler error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'src/handlers/contract.ts'), 
    contractHandlerContent
  );

  const contractServiceContent = `export class ContractService {
  async getContractStatus() {
    return {
      status: 'active',
      network: 'polkadot-hub-testnet',
      blockNumber: await this.getCurrentBlockNumber(),
      timestamp: new Date().toISOString()
    };
  }

  async interactWithContract(data: any) {
    console.log('Interacting with contract:', data);
    
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      data: data,
      timestamp: new Date().toISOString()
    };
  }

  private async getCurrentBlockNumber(): Promise<number> {
    return Math.floor(Math.random() * 1000000) + 1000000;
  }
}`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'src/services/contract.ts'), 
    contractServiceContent
  );

  const corsUtilContent = `export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'src/utils/cors.ts'), 
    corsUtilContent
  );

  const typesContent = `export interface ContractInteraction {
  method: string;
  params: any[];
  contractAddress?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ContractStatus {
  status: string;
  network: string;
  blockNumber: number;
  timestamp: string;
}`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'src/types/index.ts'), 
    typesContent
  );
}

async function createCloudFunctionsConfig(cloudFunctionsDir: string): Promise<void> {
  const serverlessConfig = `service: \${self:custom.projectName}-cloud-functions

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: \${opt:stage, 'dev'}
  environment:
    STAGE: \${self:provider.stage}
    NODE_ENV: \${self:provider.stage}

custom:
  projectName: polkadot-dapp
  serverless-offline:
    httpPort: 3001
    host: 0.0.0.0

functions:
  api:
    handler: dist/handlers/api.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

  contract:
    handler: dist/handlers/contract.handler
    events:
      - http:
          path: /contract/{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-offline`;

  await fs.writeFile(
    path.join(cloudFunctionsDir, 'serverless.yml'), 
    serverlessConfig
  );

  const envExample = `# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Contract Configuration
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000`;

  await fs.writeFile(path.join(cloudFunctionsDir, '.env.example'), envExample);

  const gitignore = `# Dependencies
node_modules/

# Distribution
dist/

# Environment variables
.env
.env.local

# Logs
*.log

# Serverless
.serverless/

# AWS
.aws/`;

  await fs.writeFile(path.join(cloudFunctionsDir, '.gitignore'), gitignore);
}
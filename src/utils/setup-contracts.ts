import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { ProjectConfig } from '../types.js';

export async function setupContracts(config: ProjectConfig): Promise<void> {
  await setupFoundryProject(config);
  await setupHardhatProject(config);
}

async function setupFoundryProject(config: ProjectConfig): Promise<void> {
  const foundryDir = path.join(config.directory, 'contracts/develop');
  
  try {
    await execa('forge', ['init', '.', '--force'], { 
      cwd: foundryDir,
      stdio: 'pipe'
    });
  } catch (error) {
    await createFoundryProjectManually(foundryDir);
  }

  await createUUPSExample(foundryDir);
  await createFoundryConfig(foundryDir);
}

async function createFoundryProjectManually(foundryDir: string): Promise<void> {
  await fs.ensureDir(path.join(foundryDir, 'src'));
  await fs.ensureDir(path.join(foundryDir, 'test'));
  await fs.ensureDir(path.join(foundryDir, 'script'));
  
  const foundryToml = `[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
    "@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/"
]

[dependencies]
openzeppelin-contracts = "5.0.0"
openzeppelin-contracts-upgradeable = "5.0.0"`;

  await fs.writeFile(path.join(foundryDir, 'foundry.toml'), foundryToml);
  
  const gitmodules = `[submodule "lib/forge-std"]
\tpath = lib/forge-std
\turl = https://github.com/foundry-rs/forge-std
[submodule "lib/openzeppelin-contracts"]
\tpath = lib/openzeppelin-contracts
\turl = https://github.com/OpenZeppelin/openzeppelin-contracts
[submodule "lib/openzeppelin-contracts-upgradeable"]
\tpath = lib/openzeppelin-contracts-upgradeable
\turl = https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable`;

  await fs.writeFile(path.join(foundryDir, '.gitmodules'), gitmodules);
}

async function createUUPSExample(foundryDir: string): Promise<void> {
  const contractContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title PolkadotDapp
 * @dev A simple upgradeable contract example for Polkadot Cloud
 */
contract PolkadotDapp is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public value;
    
    event ValueUpdated(uint256 oldValue, uint256 newValue);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(uint256 _initialValue) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        value = _initialValue;
    }
    
    function setValue(uint256 _newValue) public onlyOwner {
        uint256 oldValue = value;
        value = _newValue;
        emit ValueUpdated(oldValue, _newValue);
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    function version() public pure returns (string memory) {
        return "1.0.0";
    }
}`;

  await fs.writeFile(
    path.join(foundryDir, 'src/PolkadotDapp.sol'), 
    contractContent
  );

  const testContent = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PolkadotDapp.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract PolkadotDappTest is Test {
    PolkadotDapp public dapp;
    ERC1967Proxy public proxy;
    
    function setUp() public {
        PolkadotDapp implementation = new PolkadotDapp();
        
        bytes memory initData = abi.encodeWithSelector(
            PolkadotDapp.initialize.selector,
            42
        );
        
        proxy = new ERC1967Proxy(address(implementation), initData);
        dapp = PolkadotDapp(address(proxy));
    }
    
    function testInitialValue() public {
        assertEq(dapp.getValue(), 42);
    }
    
    function testSetValue() public {
        dapp.setValue(100);
        assertEq(dapp.getValue(), 100);
    }
    
    function testVersion() public {
        assertEq(dapp.version(), "1.0.0");
    }
}`;

  await fs.writeFile(
    path.join(foundryDir, 'test/PolkadotDapp.t.sol'), 
    testContent
  );

  const deployScript = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/PolkadotDapp.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        PolkadotDapp implementation = new PolkadotDapp();
        
        bytes memory initData = abi.encodeWithSelector(
            PolkadotDapp.initialize.selector,
            42
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        
        console.log("Implementation deployed at:", address(implementation));
        console.log("Proxy deployed at:", address(proxy));
        
        vm.stopBroadcast();
    }
}`;

  await fs.writeFile(
    path.join(foundryDir, 'script/Deploy.s.sol'), 
    deployScript
  );
}

async function createFoundryConfig(foundryDir: string): Promise<void> {
  const envExample = `# Deployment configuration
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
RPC_URL=https://testnet-passet-hub-eth-rpc.polkadot.io
ETHERSCAN_API_KEY=your_etherscan_api_key_here`;

  await fs.writeFile(path.join(foundryDir, '.env.example'), envExample);
}

async function setupHardhatProject(config: ProjectConfig): Promise<void> {
  const hardhatDir = path.join(config.directory, 'contracts/deploy');
  
  const packageJson = {
    name: `${config.name}-contracts-deploy`,
    version: '0.1.0',
    description: 'Smart contract deployment scripts',
    type: 'module',
    scripts: {
      compile: 'hardhat compile',
      test: 'hardhat test',
      deploy: 'hardhat run scripts/deploy.ts',
      'deploy:testnet': 'hardhat run scripts/deploy.ts --network polkadotHubTestnet'
    },
    dependencies: {
      '@nomicfoundation/hardhat-toolbox': '^5.0.0',
      '@parity/hardhat-polkadot': '^0.1.0',
      'hardhat': '^2.22.0'
    },
    devDependencies: {
      '@types/node': '^22.16.2',
      'typescript': '^5.6.2'
    }
  };

  await fs.writeJson(
    path.join(hardhatDir, 'package.json'), 
    packageJson, 
    { spaces: 2 }
  );

  const hardhatConfigPath = path.join(process.cwd(), 'hardhat-template.ts');
  const hardhatConfigContent = await fs.readFile(hardhatConfigPath, 'utf-8');
  
  await fs.writeFile(
    path.join(hardhatDir, 'hardhat.config.ts'), 
    hardhatConfigContent
  );

  await fs.ensureDir(path.join(hardhatDir, 'scripts'));
  await fs.ensureDir(path.join(hardhatDir, 'test'));

  const deployScript = `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Polkadot Hub...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy your contracts here
  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`;

  await fs.writeFile(
    path.join(hardhatDir, 'scripts/deploy.ts'), 
    deployScript
  );

  const envExample = `# Hardhat configuration
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000`;

  await fs.writeFile(path.join(hardhatDir, '.env.example'), envExample);
}
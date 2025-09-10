#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { toolsCommand } from "./commands/tools.js";

const program = new Command();

program
  .name("kit-dot")
  .description("A TypeScript SDK toolkit for building Dapps on Polkadot Cloud")
  .version("0.1.0")
  .enablePositionalOptions()
  .addHelpText(
    "after",
    "\nDevelopment Tools:\n  kit-dot tools install-rust     Install Rust toolchain\n  kit-dot tools install-pop-cli  Install Pop-CLI for blockchain nodes\n  kit-dot tools check            Check tool status\n  kit-dot tool pop-cli <cmd>     Execute Pop-CLI commands directly\n"
  );

program
  .command("init")
  .description("Initialize a new Polkadot Dapp project")
  .argument("[project-name]", "Name of the project")
  .option("-d, --dir <directory>", "Target directory for the project")
  .action(initCommand);

program
  .command("tools")
  .description("Manage development tools (Rust, Pop-CLI, etc.)")
  .argument(
    "[subcommand]",
    "Tools subcommand: install-rust, install-pop-cli, check"
  )
  .action(toolsCommand);

program
  .command("tool")
  .description("Execute commands with installed tools")
  .argument("<tool>", "Tool to use: pop-cli")
  .argument("[commands...]", "Commands to pass to the tool")
  .allowUnknownOption()
  .passThroughOptions()
  .action(async (tool, commands, options) => {
    const { toolCommand } = await import("./commands/tool.js");
    await toolCommand(tool, commands, options);
  });

program
  .command("build")
  .description("Build the project")
  .action(() => {
    console.log(chalk.yellow("Build command coming soon!"));
  });

program
  .command("deploy")
  .description("Deploy contracts or frontend")
  .action(() => {
    console.log(chalk.yellow("Deploy command coming soon!"));
  });

program.parse();

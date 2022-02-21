import arg from "arg";
import inquirer from "inquirer";
import { createConfig, syncFiles } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--sync": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-s": "--sync",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    runInstall: args["--install"] || false,
    sync: args["--sync"] || false,
  };
}

async function promptForMissingOptions(options) {
  if (options.skipPrompts) {
    return {
      ...options,
    };
  }

  const questions = [];
  // if (!options.template) {
  //   questions.push({
  //     type: "list",
  //     name: "template",
  //     message: "Please choose which project template to use",
  //     choices: ["JavaScript", "TypeScript"],
  //     default: defaultTemplate,
  //   });
  // }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  if (options.sync) {
    return syncFiles(options);
  }

  createConfig(options);
}

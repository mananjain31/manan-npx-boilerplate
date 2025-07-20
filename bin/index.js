#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const inquirer = require("inquirer");

const src = path.join(__dirname, "../template");
const dest = process.cwd();

async function prompt() {
  const { projectName, projectDescription } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project Name",
      default: "my-app",
    },
    {
      type: "input",
      name: "projectDescription",
      message: "Description (optional)",
      default: "A project created using mananjain31's custom boilerplate",
    },
  ]);
  return { projectName, projectDescription };
}

function copyRecursive(srcDir, destDir, data) {
  fs.readdirSync(srcDir).forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyRecursive(srcPath, destPath, data);
    } else {
      const fileData = fs.readFileSync(srcPath, "utf-8");
      const renderedFileData = ejs.render(fileData, data);
      fs.writeFileSync(destPath, renderedFileData, "utf-8");
    }
  });
}

async function main() {
  const answers = await prompt();
  console.log(`Setting up project: ${answers.projectName}`);
  copyRecursive(src, dest, answers);
  console.log("✅ Project initialized!");
}

await main();

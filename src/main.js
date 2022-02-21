import fs from "fs";
import glob from "glob";
import path from "path";
import chalk from "chalk";
import axios from "axios";
import FormData from "form-data";

const delimiter = "-->";

export async function createConfig(options) {
  if (fs.existsSync("./markist.config.js")) {
    console.log("markist.config.js already exists");
    return;
  }
  fs.writeFileSync(
    "./markist.config.js",
    `
  module.exports = {
    source: ""
  }
  `
  );

  console.log(options, "--- options");
}

export async function syncFiles(options) {
  const config = JSON.parse(fs.readFileSync("./markist.config.json", "utf8"));
  console.log(config, "--- config");

  if (!config) {
    console.log("No Markist config found");
    return;
  }

  // get root directory
  const root = path.basename(path.dirname("../"));
  const todoFiles = glob.sync(`${config.source}`);
  console.log(chalk.green(delimiter), `Found ${todoFiles.length} files`);

  todoFiles.forEach(async (file) => {
    const fileName = path.basename(file);
    const filePath = path.join(root, fileName);
    const readableStream = fs.createReadStream(filePath);
    const title = fileName.split(".")[0];
    const form = new FormData();

    form.append("title", title);
    form.append("file", readableStream);

    try {
      console.log(chalk.green(delimiter), `Uploading: ${title}`);

      await axios.post("http://localhost:4000/api/upload", form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      if (resp.status === 200) {
        return "Upload complete";
      }
    } catch (err) {
      return new Error(err.message);
    }
  });
}

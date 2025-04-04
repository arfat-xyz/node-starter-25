/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user for the commit message
rl.question("Enter your commit message: ", commitMessage => {
  if (!commitMessage) {
    console.error("Error: Please provide a commit message.");
    console.log('Usage: node push.js "Your  commit message"');
    process.exit(1);
  }

  // Function to execute commands and handle their output
  const executeCommand = (command, successMessage, isPushCommand = false) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
          return;
        }

        if (isPushCommand && stderr && stderr.includes("main -> main")) {
          console.log(`Git Push Success: ${stderr}`);
          resolve(stdout);
          return;
        }

        if (stderr) {
          reject(`Stderr: ${stderr}`);
          return;
        }

        if (stdout) {
          console.log(successMessage, stdout);
        }
        resolve(stdout);
      });
    });
  };

  // Step 1: Execute lint check
  executeCommand("yarn lint:check", "Linting completed with output:")
    .then(() => {
      // Step 2: Execute prettier check
      return executeCommand(
        "yarn prettier:check",
        "Prettier check completed with output:",
      );
    })
    .then(() => {
      // Step 3: Execute git add
      return executeCommand("git add .", "Files added successfully:");
    })
    .then(() =>
      // Step 4: Execute git commit
      executeCommand(
        `git commit -m "${commitMessage}"`,
        "Commit message added:",
      ),
    )
    .then(commitOutput => {
      console.log("Commit Output:", commitOutput);
      // Step 5: Execute git push
      return executeCommand(
        "git push",
        "Push to remote repository successful:",
        true,
      );
    })
    .then(() => {
      // Step 6: Run yarn start
      console.log("Starting the server...");
      const devProcess = exec("yarn start", (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
      });

      // Ensure to capture and log the output of `yarn start`
      devProcess.stdout.on("data", data => {
        process.stdout.write(data); // Directly output without prefix
      });

      devProcess.stderr.on("data", data => {
        process.stderr.write(data); // Directly output without prefix
      });

      devProcess.on("close", code => {
        console.log(`Server process exited with code ${code}`);
        rl.close();
      });
    })
    .catch(error => {
      console.error(error);
      rl.close();
    });
});

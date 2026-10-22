import { spawn } from "child_process";

const backend = spawn(process.execPath, ["dbServer.js"], {
  cwd: "backend",
  stdio: "inherit",
});

const frontend = spawn(
  process.execPath,
  ["node_modules/react-scripts/bin/react-scripts.js", "start"],
  { stdio: "inherit" }
);

const stop = () => {
  backend.kill();
  frontend.kill();
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

backend.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Backend stopped with exit code ${code}.`);
  }
});

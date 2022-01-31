import { fork } from "child_process";
import { Worker } from "worker_threads";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getRandoms = (req, res) => {
  const { cant = 1e8 } = req.query;
  if (Number(cant)) {
    let resWasSent = false;
    const startTime = Date.now();
    const child = fork(
      path.join(__dirname, "..", "childProcesses", "calcRandomNumbers.js")
    );

    child.on("message", msg => {
      //handshake
      if (msg === "ready")
        child.send({
          action: "start",
          payload: { min: 1, max: 1000, qty: Number(cant) }
        });
      else {
        const endTime = Date.now();
        !resWasSent &&
          res.json({
            method: "Fork - Child process",
            elapsedTime: `${(endTime - startTime) / 1000} s`,
            numbers: msg
          });
        resWasSent = true;
      }
    });
    child.on("error", error => {
      console.log(
        `Error en Child process 'calcRandomNumbers' con pid:${child.pid}:\n${error}`
      );
      !resWasSent &&
        res.status(500).send({ error: "error interno del servidor" });
      resWasSent = true;
    });
    child.on("close", code => {
      console.log(
        `Child process 'calcRandomNumbers' con pid:${child.pid} terminado con código ${code}`
      );
      if (code !== 0) {
        !resWasSent &&
          res.status(500).send({ error: "error interno del servidor" });
        resWasSent = true;
      }
    });
  } else res.json({ error: "valor de parámetro inválido" });
};

export const getRandomsWT = (req, res) => {
  const { cant = 1e8 } = req.query;
  if (Number(cant)) {
    let resWasSent = false;
    const startTime = Date.now();
    const worker = new Worker(
      path.join(__dirname, "..", "workerProcesses", "calcRandomNumbers.js")
    );

    worker.on("message", msg => {
      //handshake
      if (msg === "ready")
        worker.postMessage({
          action: "start",
          payload: { min: 1, max: 1000, qty: Number(cant) }
        });
      else {
        const endTime = Date.now();
        !resWasSent &&
          res.json({
            method: "Worker thread",
            elapsedTime: `${(endTime - startTime) / 1000} s`,
            numbers: msg
          });
        resWasSent = true;
      }
    });
    worker.on("error", error => {
      console.log(
        `Error en Worker thread 'calcRandomNumbers' con pid:${worker.pid}:\n${error}`
      );
      !resWasSent &&
        res.status(500).send({ error: "error interno del servidor" });
      resWasSent = true;
    });
    worker.on("exit", code => {
      console.log(
        `Worker thread 'calcRandomNumbers' terminado con código ${code}`
      );
      if (code !== 0) {
        !resWasSent &&
          res.status(500).send({ error: "error interno del servidor" });
        resWasSent = true;
      }
    });
  } else res.json({ error: "valor de parámetro inválido" });
};

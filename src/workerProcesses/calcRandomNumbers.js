import { parentPort } from "worker_threads";

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomNumbers(min, max, qty) {
  const randoms = {};
  for (let i = 0; i < parseInt(qty); i++) {
    const number = getRandomNumber(min, max);
    randoms[number] ? randoms[number]++ : (randoms[number] = 1);
  }
  return randoms;
}

console.log(
  `Worker thread 'calcRandomNumbers' iniciado con pid:${process.pid}`
);
parentPort.on("message", msg => {
  const { action, payload } = msg;
  if (action === "start") {
    const { min, max, qty } = payload;
    const result = getRandomNumbers(min, max, qty);
    parentPort.postMessage(result);
    process.exit();
  }
});
//Handshake
parentPort.postMessage("ready");

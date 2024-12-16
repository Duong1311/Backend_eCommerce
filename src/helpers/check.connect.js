const mongoose = require("mongoose");
const _TIMEOUT = 5000;
const os = require("os");
const process = require("process");
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};
//check overload connection
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    //gia su 1 core co the xu ly 5 connection
    const maxConnection = numCores * 5;
    console.log(`Number of connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnections > maxConnection) {
      console.log(`Server is overloaded`);
    }
  }, _TIMEOUT); //monitor every 5 seconds
};
module.exports = { countConnect, checkOverload };

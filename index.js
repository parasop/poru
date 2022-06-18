module.exports = {
    Node: require("./src/Node"),
    Player: require("./src/Player"),
    Poru: require("./src/Poru")
}
process.on('unhandledRejection', error => {
    if (error.code === '10008' || error.code === '10062') return;
    console.log(error.stack);
  });
  process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
  });
  
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
  });
  
  process.on('multipleResolves', (type, promise, reason) => {
    console.log(type, promise, reason);
  });
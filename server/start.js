const monitor = process.argv.some((value) => { return value === 'monitor'; });
if (monitor) {
  console.log('monitoring via newrelic');
  require('newrelic');
}
const app = require('./index.js');
const port = 2002;
const cluster = require('cluster');
const cpus = require('os').cpus;
const numCPUs = cpus().length;

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(port, () => {
    console.log(`Audible title service listening at http://localhost:${port}`);
  });
}
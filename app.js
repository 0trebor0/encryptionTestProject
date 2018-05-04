const args = process.argv.slice(2),
host = require('./lib/host');

//node app client 127.0.0.1 4317
host.methods.startServer(args);
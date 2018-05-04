const methods = {},
net = require('net'),
config = require('../config.json'),
encryption = require('./encryption'),
client = require('./client'),
clients = {};
let newKey = 'empty';
methods.startServer = (args)=>{
    if(args[0] == 'client'){
        client.methods.connectClient(args);
    }else{
        const server = net.createServer();
        server.listen(config['serverPort']);
        server.on('listening', ()=>{
            console.log('Server Started on PORT:',config['serverPort']);
        });
        server.on('error', (error)=>{
            try{}catch(error){
                throw error;
            }
        });
        server.on('connection', (socket)=>{
            methods.hostConnection(socket);
        });
    }
}
methods.hostReply = (socket,data)=>{
    var encrypted = encryption.methods.encrypt(config['hashKey']+newKey,data.toString('hex'));
    console.log('[SENDING]',encrypted,' ',data,);
    socket.write(encrypted);
}
methods.hostConnection = (socket)=>{
    socketId = socket.remoteAddress + ":" + socket.remotePort;
    clients[socketId] = socket;
    console.log(socketId,'Connected');
    clients[socketId].on('data', (chunk)=>{
        var decrypted = encryption.methods.decrypt(config['hashKey']+newKey,chunk.toString('utf8'));
        console.log('[RECEIVED]',chunk.toString('hex'),' ',decrypted);
        if(newKey == 'empty'){
            newKeyTest = Buffer.from('HEYTHEREBOU').toString('hex');
            methods.hostReply(socket, newKeyTest);
            newKey = newKeyTest;
            setTimeout(function(){
                methods.hostReply(socket, 'TEST32121');
            }, 3000);
        }else{
            setTimeout(function(){
                methods.hostReply(socket, 'PING DONE');
            }, 3000);
        }
    });
    clients[socketId].on('close', ()=>{
        console.log(socketId,'Diconnected');
        delete clients[socketId];
    });
    clients[socketId].on('error', (error)=>{
        try{}catch(error){
            throw error;
        }
    });
}
exports.methods = methods;
var methods = {},
net = require('net'),
config = require('../config.json'),
encryption = require('./encryption'),
newKey = 'empty';
methods.clientReply = (client,data)=>{
    var encrypted = encryption.methods.encrypt(config['hashKey']+newKey, data.toString('hex'));
    console.log('[SENDING]',encrypted,' ',data,);
    client.write(encrypted);
}
methods.connectClient = (args)=>{
    let client = new net.Socket();
    client.connect(args[2],args[1],()=>{
        console.log('Connected to '+args[2]+':'+args[1]);
        methods.clientReply(client,'hello')
    });
    client.on('error', (error)=>{
        try{}catch(error){
            throw error;
        }
    });
    client.on('close',()=>{
        console.log('Server was Shutdown');
    });
    client.on('data',(chunk)=>{
        var decrypted = encryption.methods.decrypt(config['hashKey']+newKey,chunk.toString('utf8'));
        console.log('[RECEIVED]',chunk.toString('hex'),' ',decrypted);
        if(newKey == 'empty'){
            newKey = decrypted;
        }else{
            setTimeout(function(){
                methods.clientReply(client,'ping')
            }, 3000);
        }
    });
}
exports.methods = methods;
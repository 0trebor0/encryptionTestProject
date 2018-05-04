const crypto = require('crypto'),
methods = {},
config = require('../config.json');
methods.encrypt = (key, data)=>{
    var cipher = crypto.createCipher(config['algorithm'], key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    try{
        crypted += cipher.final('hex');
    }catch(error){
        console.log('Error: Bad Password');
        console.log(error);
    }
    return crypted;
}
methods.decrypt = (key, data)=>{
    var decipher = crypto.createDecipher(config['algorithm'], key);
    var decrypted = decipher.update(data, 'hex', 'utf-8');
    try{
        decrypted += decipher.final('utf-8');
    }catch(error){
        console.log('Error: Bad Password');
        console.log(error);
    }
    return decrypted;
}  

exports.methods = methods;
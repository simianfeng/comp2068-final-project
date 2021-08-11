const mongoose = require('mongoose');
//create plm object that includes authentication related functionality
const plm = require('passport-local-mongoose');

var schemaDefinition = {
    username: String,
    password: String, 
    oathId: String,
    oauthProvider: String, 
    created: Date
};

var userSchema= new mongoose.Schema(schemaDefinition);

//inject passport authentication functionality into this model using plugins
//encrypting passwords using salt and hash
//user serialize and deserialize
userSchema.plugin(plm);

module.exports = new mongoose.model('User', userSchema);

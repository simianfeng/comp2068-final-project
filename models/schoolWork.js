// Import mongoose
const mongoose = require('mongoose');
const schoolWorkSchemaDefinition = {
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    course: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "haven't started yet"
    },
    weight:{
        type: String,
        required: true
    },
    priority:{
        type: String,
        required: true
    }

};
var schoolWorkSchema = new mongoose.Schema(schoolWorkSchemaDefinition);
module.exports = mongoose.model('schoolWork', schoolWorkSchema);;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let registrationSchema = new Schema({
    firstName:{type: String, default: '',required:true },
    lastName:{type: String, default: '',required:true },
    email:{type: String, default: '',required:true },
    mobile:{type:Number,required:true},
    password:{type: String, default: '',required:true }
},{timestamps:true})

module.exports = mongoose.model('register ', registrationSchema,"register");
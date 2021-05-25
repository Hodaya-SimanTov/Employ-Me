const Joi = require('joi');
const mongoose = require('mongoose');
const Employer = mongoose.model('Employer', new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minlength: 3,
        maxlength: 50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minlength: 3,
        maxlength: 50
    },
    phone:{
        type:String,
        required:true,
        length: 10
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    companyName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength: 128
    },
    role:{
        type:String,
        default:" "
    } 
}));
function validateEmployer(employer) {
    const schema = Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required(),
        email: Joi.string().required().email(),
        companyName: Joi.string().required(),
        password: Joi.string().min(6).max(128).required(),
        role: Joi.string().default(" ").empty("")
    });
    return  schema.validate(employer);
}
function validateEditEmployer(employer) {
    const schema = Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().length(10).required(),
        companyName: Joi.string().required(),
        role: Joi.string().default(" ").empty("")
    });
    return  schema.validate(employer);
}
exports.Employer = Employer;
exports.validate = validateEmployer;
exports.validateEditEmployer = validateEditEmployer;


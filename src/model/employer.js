const Joi = require('joi');
const mongoose=require('mongoose')
const Employer=mongoose.model('Employer',new mongoose.Schema({
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
        minlength: 5,
        maxlength: 100,
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
        default:0
    } 
}));
function validateEmployer(employer) {
    const schema =Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required(),
        email: Joi.string().min(5).max(100).required().email(),
        companyName: Joi.string().required(),
        password: Joi.string().min(6).max(128).required(),
        role: Joi.string().default(0)
    });
    return  schema.validate(employer);
}
exports.Employer = Employer;
exports.validate = validateEmployer;


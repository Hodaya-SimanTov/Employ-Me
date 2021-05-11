const Joi = require('joi');
const mongoose=require('mongoose')

const CompanyWorker=mongoose.model('CompanyWorker',new mongoose.Schema({
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
    mail:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength: 128
    }
}));
function validateCompanyWorker(companyWorker) {
    const schema =Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).max(128).required(),
    });
    return  schema.validate(companyWorker);
}
function validateEditCompanyWorker(companyWorker) {
    const schema =Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required(),
    });
    return  schema.validate(companyWorker);
}
exports.CompanyWorker = CompanyWorker;
exports.validate = validateCompanyWorker;
exports.validateEditCompanyWorker=validateEditCompanyWorker;

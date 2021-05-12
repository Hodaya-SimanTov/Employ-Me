const { Double } = require('bson')
const { uniq } = require('lodash')
const Joi = require('joi');
const mongoose=require('mongoose')
const ContractorWorker=mongoose.model('ContractorWorker',new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true
    },
    birthday:{
        type:Date,
        require:true
    },
    mail:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true,
        length: 10
    },
    occupationArea:{//תחום עיסוק
        type:String,
        require:false,
        default:0
    },
    experienceField:{//ניסיון בתחום
        type:String,
        require:false,
        default:0
    },
    serviceArea:{//איזור שירות
        type:String,
        require:false,
        default:0
    },
    scopeWork:{//היקף משרה
        type:String,
        require:false,
        default:0
    },
    hourlyWage:{//שכר שעתי
        type:Number,
        require:false,
        default:0
    },
    password:{
        type:String,
        require:true,
        minlength:6,
        maxlength: 128
    },
    unavailability:{
        type:mongoose.Types.ObjectId,
        ref:"UnavailabilityContractor"
    }
}));


function validateContractor(contractor) {
    const schema =Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required(),
        mail: Joi.string().required(),
        password: Joi.string().min(6).max(128).required()
    });
    return  schema.validate(contractor);
}
function validateEditContractor(contractor) {
    const schema =Joi.object( {
        firstName: Joi.string().min(3).max(50).trim().required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        phone: Joi.string().length(10).required()
    });
    return  schema.validate(contractor);
}

exports.ContractorWorker = ContractorWorker;
exports.validate = validateContractor;
exports.validateEditContractor=validateEditContractor;


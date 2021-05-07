const { Double } = require('bson');
const Joi = require('joi');
const mongoose=require('mongoose')
const Employement=mongoose.model('Employement',new mongoose.Schema({
    employerEmail:{
        type:String,
        required:true
    },
    constructorEmail:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        require:true
    },
    jobScope:{
        type:Number,
        required:true,
        min:1,
        max: 24
    },
    status:{
        type:String,
        required:true
    },
    hourlyWage:{
        type:Double,
        required:true,
        min:1
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5,
        default: 0
    },
    feedback:{
        type:String,
        required:true,
    }
}));
function validateEmployement(employement) {
    const schema =Joi.object( {
        employerEmail: Joi.string().required().email(),
        constructorEmail: Joi.string().required().email(),
        date: Joi.date().required(),
        jobScope: Joi.Number().min(1).max(24).required(),
        status: Joi.string().required(),
        hourlyWage: Joi.Double.min(1).required(),
        rating: Joi.Number().min(0).max(5).default(0).required(),
        lastName: Joi.string().min(3).max(50).trim().required(),
        feedback: Joi.string().required()
    });
    return  schema.validate(employement);
}

exports.Employement = Employement;
exports.validate = validateEmployement;



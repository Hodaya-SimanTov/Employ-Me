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
        max: 12
    },
    status:{
        type:String,
        required:true
    },
    hourlyWage:{
        type:Number,
        required:true,
        min:1
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default: 0
    },
    feedback:{
        type:String,
    },
    start:{
        type:String
    }
}));
function validateEmployement(employement) {
    const schema =Joi.object( {
        employerEmail: Joi.string().required().email(),
        constructorEmail: Joi.string().required().email(),
        date: Joi.date().required(),
        jobScope: Joi.number().min(1).max(24).required(),
        status: Joi.string().required(),
        hourlyWage: Joi.number().min(1).required(),
        rating: Joi.number().min(0).max(5).default(0).required().empty(""),
        feedback: Joi.string().empty("")
    });
    return  schema.validate(employement);
}
exports.Employement = Employement;
exports.validateEmployement = validateEmployement;



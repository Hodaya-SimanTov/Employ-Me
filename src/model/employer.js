const mongoose=require('mongoose')

const EmployerSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    mail:{
        type:String,
        require:true
    },
    companyName:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    rule:{
        type:String,
        default:0
    } 
})

module.exports=mongoose.model('Employer',EmployerSchema)
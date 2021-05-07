const mongoose=require('mongoose')

const CompanyWorkerSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true
    },
    mail:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },

})
module.exports=mongoose.model('CompanyWorker',CompanyWorkerSchema)
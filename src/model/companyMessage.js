const mongoose=require('mongoose')


var CompanyMessageSchema=mongoose.Schema({
    contractorMail:{
        type:String
    },
    date:{
        type:Date
    },
    type:{
        type:String
    },
    text:{
        type:String
    },
    jobScope:{
        type:Number,
        required:true,
        min:1,
        max: 12
    },
    startTime:{
        type:String,
        default:"0"
    },
    endTime:{
        type:String,
        default:"0"
    },
    employmentId:{
        type:mongoose.Types.ObjectId,
        ref:"Employement"
    }
})

module.exports=mongoose.model('CompanyMessage',CompanyMessageSchema)
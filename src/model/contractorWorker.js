const { Double } = require('bson')
const mongoose=require('mongoose')

const ContractorWorkerSchema=mongoose.Schema({
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
        require:true
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
        minlength:6
    },
    unavailability:{
        type:mongoose.Types.ObjectId,
        ref:"UnavailabilityContractor"
    }
})

module.exports=mongoose.model('ContractorWorker',ContractorWorkerSchema)


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
    id:{
        type:String,
        require:true
    },
    birthday:{
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
    occupationArea:{//תחום עיסוק
        type:String,
        require:true
    },
    experienceField:{//ניסיון בתחום
        type:String,
        require:true
    },
    serviceArea:{//איזור שירות
        type:String,
        require:true
    },
    scopeWork:{//היקף משרה
        type:String,
        require:true
    },
    hourlyWage:{//שכר שעתי
        type:String,
    },
    password:{
        type:String,
        require:true,
        minlength:6
    }
})

module.exports=mongoose.model('ContractorWorker',ContractorWorkerSchema)
const mongoose=require('mongoose')

const ContractorMessageSchema=mongoose.Schema({
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
    }
})

module.exports=mongoose.model('ContractorMessage',ContractorMessageSchema)
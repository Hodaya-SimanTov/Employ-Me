const mongoose=require('mongoose')

const UnavailabilityContractorSchema=mongoose.Schema({
    unavailabArray:[{
        type:Date
    }],
    contractorId:{
        type:mongoose.Types.ObjectId,
        ref:"ContractorWorker"
    }
})


module.exports=mongoose.model('UnavailabilityContractor',UnavailabilityContractorSchema)
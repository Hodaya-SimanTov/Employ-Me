
const mongoose=require('mongoose')

const ContractorPaycheck=mongoose.model('ContractorPaycheck',new mongoose.Schema({
    month:{
        type:String,
        require:true
    },
    year:{
        type:String,
        require:true
    },
    contractorMail:{
        type:String,
        require:true
    },    
    totalHours:{
        type:Number,
        require:true
    },
    totalShifts:{
        type:Number,
        require:true
    },
    totalVacation:{
        type:Number,
        require:true
    },
    totalSalary:{
        type:Number,
        require:true,
        default:0
    },
    contractorName:{
        type:String,
        require:true
    },
    hourlyWage:{
        type:Number,
        require:false,
        default:0
    },
    tHours:{
        type:Number,
        require:true
    },
    tShifts:{
        type:Number,
        require:true
    },
    tVacation:{
        type:Number,
        require:true
    }
}));


exports.ContractorPaycheck = ContractorPaycheck;

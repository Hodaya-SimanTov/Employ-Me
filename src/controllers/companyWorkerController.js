const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken');
//const ContractorWorker=require('../model/contractorWorker');
const Unavailability=require('../model/unavailabilityContractor');
//const bcrypt = require('bcrypt');
const { CompanyWorker, validate,validateEditCompanyWorker } = require('../model/companyWorker');
const {Employement, validateEmployement} = require('../model/employement');
const { ContractorWorker, validateContractor,validateEditContractorWorker } = require('../model/contractorWorker');
const CompanyMessage=require('../model/companyMessage');

const { Employer, validate2,validateEditEmployer } = require('../model/employer');

//const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
var cron = require('node-cron');

//הוספת עובדי משאבי אנוש
const addCompanyWorker = (req,res) => {
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(req.body.mail).toLowerCase())) {
        if (companyExists(req.body.mail) == false) {
            console.log(req.body);
            const newComapnyWorker = new CompanyWorker(req.body)
                newComapnyWorker.save().then(companyWorker => {
                    res.send('success to add db')
                    console.log('succ');
                }).catch(err => {
                    console.log(`can not add this worker! ${err}`);
                })
        }
        else {
            console.log('exists!!');
        }
    }
    else {
        console.log('not valid!!');
    }
}

const companyExists = (mail) => {
    CompanyWorker.findOne({ mail:mail }).then(CompanyWorker=> {
        console.log('exists');
        return true;
    }).catch(err=> {
        console.log(`not exists!! ${err}`);
        return false;
    })
    return false;
}
//מחיקת עובד משאבי אנוש
const deleteCompanyWorkerById = (req,res) => {
    CompanyWorker.findByIdAndDelete(req.params.id).then(CompanyWorker=> {
        res.send('success to dalete')
    }).catch(err => {
        console.log(`can not delete this worker! ${err}`);
    })
}
//עובד חברה לפי מייל
const getCompanyWorkerByEmail = async(mail) => {

    let companyWorker = await CompanyWorker.findOne({mail:req.params.mail})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',{companyWorker})
    }
    else {
        return res.status(400).send('That mail is error!');
    }
}
/*
//סיסמא
const resetPassword = async (req, res) => {
    const { mail } = req.body.mail
    const name = req.body.firstName
    let randomstring = Math.random().toString(36).slice(-8)
    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(randomstring, salt);
    let companyWorker = await CompanyWorker.findOne({ mail: req.body.mail }).then(companyWorker=>{
        companyWorker.password=password
        companyWorker.markModified('password')
        companyWorker.save(err => console.log(err))
    })

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ravitlevi999@gmail.com',
            pass: 'ravit99clark'
        }
    })

    let mailOptions = {
        from: 'ravitlevi999@gmail.com',
        to: email,
        subject: 'password reset',
        text: `Hello ${name},\nYour password has been reset and your password is now is:  ${randomstring}\n,Sincerely, The Site Staff`
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
*/
//הצגת פרופיל
const editProfileDisplay = async (req, res) => {
    console.log('req.params.mail');
    console.log(req.params.mail);
    let companyWorker = await CompanyWorker.findOne({mail:req.params.mail})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',{companyWorker:companyWorker});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
//עריכת פרופיל
const editProfile = async (req, res) => {
    let companyWorker = await CompanyWorker.findOneAndUpdate({mail: req.params.mail}, req.body, {new: true });
    res.redirect(`/companyWorker/homePage/${req.params.mail}`);
    console.log('infoCompanyWorker1/1');
    //infoCompanyWorker();
    console.log('infoCompanyWorker1/2');


}

const updateCompanyWorkerPass = (req,res) => {
    console.log(`in update pass`);
    CompanyWorker.findOneAndUpdate({mail: req.params.mail}, {password: req.body.password})
        .then(companyWorker => {
            console.log(req.body.password);
            console.log(req.body.mail);
            res.redirect(`/companyWorker/homePage/${req.params.mail}`);
        }).catch(err => {
        console.log(`can not update this paa! ${err}`);
    })

}
//  פונקציה שמחזירה עובדים שעומדים בסינונים ופנויים בתאריך
const searchContractorByFields = async(req, res) => {
   // const avilableConsArr = await ContractorAvialableDate(req.body.employmentDate);
    var result;
    var filteredCons = [];
    if(req.body.service == 'select') {
        if(req.body.scope == 'select') {
            if(req.body.experience == 'select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea: req.body.occupation})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, experienceField:req.body.experience})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
        else {
            if(req.body.experience == 'select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, scopeWork:req.body.scope})
                    console.log(filteredCons);
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, scopeWork:req.body.scope, experienceField:req.body.experience})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
    else {
        if(req.body.scope == 'select') {
            if(req.body.experience == 'select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation ,serviceArea:req.body.service})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, experienceField:req.body.experience})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
        else {
            if(req.body.experience == 'select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, scopeWork:req.body.scope})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerSearchResult',{result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, scopeWork:req.body.scope, experienceField:req.body.experience})
                    result = await availableCons(filteredCons);
                    res.render('../views/companyWorkerHomePage', {result:result});
                }
                catch(err) {
                    console.log(err);
                }
            }
        }
    }
}

const bookContractorDisplay = async (req, res) => {
    let contractor = await ContractorWorker.findById(req.params.idConstractor)
    let employer = await Employer.find()
    /*if (!contractor || !employer) {
        return res.status(400).send('That error in system');
    }*/

    res.render('../views/bookContractor', {contractor: contractor, date: req.params.date, companyName: employer.companyName});

}
const bookContractor = async (req, res) => {
    let contractor = await ContractorWorker.findById(req.params.idConstractor)
    //let employer = await Employer.findOne({email: req.params.emailEmployer})
    /*if (!contractor || !employer) {
        return res.status(400).send('That error in system');
    }*/

        let employement = new Employement({ constructorEmail: contractor.mail, date: req.params.date, jobScope: req.body.numBusinessHours, status: 'waiting for approval',hourlyWage: contractor.hourlyWage, rating: 0, feedback:'',occupationArea: contractor.occupationArea});
        await employement.save();
        // console.log({id: contractor.unavailability,date:req.params.date})
        ContractorWorkeController.addDateToUnavailabilityarray(contractor.unavailability, req.params.date,req.params.date);
        res.redirect(`/companyWorker/homePage/${req.params.mail}`);

}

// פונקציה שמציבה במערך את המייל ומספר ההעסקות של כל מעסיק
const infoCompanyWorker = async() => {
    try {
        console.log('infoCompanyWorker');
        var arrMail = [];
        var arrNum = [];
        var i = 0;
        var j = 0;
        //const d = new Date(date)
        //const myDate = new Date(d.getFullYear(), d.getMonth(), d.getUTCDate() + 1)
        let employers = await Employer.find();
        //console.log(employers[0].email);
        //console.log(employers.length);
        for (i = 0; i < employers.length; i++) {
            arrMail[i] = employers[i].email;
            let employements = await Employement.find();
            arrNum[i]=0;
            for (j = 0; j < employements.length; j++) {
                //console.log(array[i]);
                if (arrMail[i] == employements[j].employerEmail) {
                    arrNum[i] = arrNum[i]+1;
                    //console.log(array2[i]);
                }
            }
        }
        res.render('../views/companyWorkerMenuEmployers', {arrMail:arrMail,arrNum:arrNum});
    }
    catch(err) {
        console.log(err);
    }
    console.log('infoCompanyWorker2');
    //console.log(array[0]);
}
//הצגת כל העובדים
const allCompany = async (req,res) => {
    try {
        console.log(req.params.mail);
        let fEmployment = await ContractorWorker.find();
        res.render('../views/companyWorkerMenuContractor', {fEmployment:fEmployment,mailCompany:req.params.mail });
    }
    catch(err) {
        console.log(err);
    }
    var d=new Date();
    console.log("cron reportCheck");

}
//הצגת כל המעסיקים
const allEmployer = async (req,res) => {
    try {
        console.log('infoCompanyWorker');
        var arrMail = [];
        var arrNum = [];
        var i = 0;
        var j = 0;
        //const d = new Date(date)
        //const myDate = new Date(d.getFullYear(), d.getMonth(), d.getUTCDate() + 1)
        let employers = await Employer.find();
        let employements = await Employement.find();

        //console.log(employers[0].email);
        //console.log(employers.length);
        for (i = 0; i < employers.length; i++) {
            arrMail[i] = employers[i].email;
            arrNum[i]=0;
            for (j = 0; j < employements.length; j++) {
                //console.log(array[i]);
                if (arrMail[i] == employements[j].employerEmail) {
                    arrNum[i] = arrNum[i]+1;
                }
            }
            console.log('i='+ i +'   '+arrNum[i]);
        }
      //res.render('../views/companyWorkerMenuEmployers', {arrMail:arrMail,arrNum:arrNum});

        console.log(req.params.mail);
        res.render('../views/companyWorkerMenuEmployers', {employers:employers,mailCompany:req.params.mail,arrMail:arrMail,arrNum:arrNum});
    }
    catch(err) {
        console.log(err);
    }
}
const infoCompany = async (req, res) => {
    try {
        //let closedEmp = await Employement.find({employerEmail: req.params.email, status:'close'});
        //let cancelEmp = await Employement.find({employerEmail: req.params.email, status:'canceled'});
        //let waitConEmp = await Employement.find({employerEmail: req.params.email, status:'waiting for approval'});
        //let waitEmpEmp = await Employement.find({employerEmail: req.params.email, status:'verified'});
        let conAreaNorth=await  ContractorWorker.find({serviceArea:"North"});
        let conAreaSouth=await  ContractorWorker.find({serviceArea:"South"});
        let conAreaLowlands=await  ContractorWorker.find({serviceArea:"Lowlands"});
        let conAreaJerusalem=await  ContractorWorker.find({serviceArea:"Jerusalem Area"});
        let conAreaDan=await  ContractorWorker.find({serviceArea:"Dan Area"});
        let conAreaGalilee=await  ContractorWorker.find({serviceArea:"Galilee"});
        let kind=await  ContractorWorker.find();
        let rateNum = await Employement.find({rating: { $nin:[0] }});
        let empNum = await Employer.find();
        let conNum = await ContractorWorker.find();

        console.log(rateNum);
        var lastDate = 0;
        var count = 0;
        var avgRate = 0;
        var countRate = 0;
        var countNorth = 0;
        var countSouth = 0;
        var countLowlands = 0;
        var countJerusalem = 0;
        var countDan = 0;
        var countGalilee = 0;
        var countEmp = 0;
        var countCon = 0;
        var arrKindNum=[];
        var arrKind=['Biotech','Cleaning','Human resources','Customer service','Finance','Digital','High-tech',
            'Insurance','Marketing','Offices','Operations and logistics','Production workers','Renovations','Sales','Technical','Waitresses'];
        //כמה עובדים מכל תחום עיסוק

        for (let j = 0; j < arrKind.length; j++) {
            arrKindNum[j]=0;
            for (let i = 0; i < kind.length; i++) {
            if (kind[i].occupationArea == arrKind[j])
                arrKindNum[j]+=1;
        }
    }
        console.log('arrKind');
        console.log(arrKind[2]);
        console.log(arrKindNum[2]);
        console.log('arrKind');

        for (let i = 0; i < rateNum.length; i++) {
            count += rateNum[i].rating;
        }
        //ממוצע דירוגים לכלל ההעסקות
        if (rateNum.length != 0) {
            avgRate = count / rateNum.length;
            countRate = rateNum.length;
        }
        //מס עובדים ומעסיקים
        console.log(empNum.length);
        countEmp=empNum.length;
        console.log(countEmp);
        countCon=conNum.length;

        //מספר העובדים מאזור בארץ מסויים
        console.log(avgRate);
        console.log(countRate);
        if (conAreaNorth != 0) {
            countNorth= conAreaNorth.length;
        }
        if (conAreaSouth != 0) {
            countSouth= conAreaSouth.length;
        }
        if (conAreaLowlands != 0) {
            countLowlands= conAreaLowlands.length;
        }
        if (conAreaJerusalem != 0) {
            countJerusalem= conAreaJerusalem.length;
        }
        if (conAreaDan != 0) {
            countDan= conAreaDan.length;
        }
        if (conAreaGalilee != 0) {
            countGalilee = conAreaGalilee.length;
        }
        console.log(countEmp);
       // console.log({kindAmount:kindAmount, kind:kind});
        res.render('../views/companyWorkerInfo', {mail: req.params.mail,avgRate: avgRate, countNorth: countNorth, countSouth: countSouth, countLowlands: countLowlands, countJerusalem: countJerusalem, countDan: countDan, countGalilee: countGalilee,countCon:countCon,countEmp:countEmp,arrKind:arrKind,arrKindNum:arrKindNum});
    }
    catch(err) {
        console.log(err);
    }
}
/*
//מחיקת עובד
const deleteContractorWorkerById = (req,res) => {
    ContractorWorker.findByIdAndDelete(req.params.id).then(contractorWorker => {
        res.send('success to dalete');
    }).catch(err => {
        console.log(`can not delete this worker! ${err}`);
    });
}
*/

const resetPasswordDisplay = async (req, res) => {
    let companyWorker = await CompanyWorker.findOne({mail:req.params.mail})
    if (companyWorker) {
        res.render('../views/resetPasswordCompanyWorker', companyWorker);
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
const resetPassword = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    let companyWorker = await CompanyWorker.findOneAndUpdate({mail: req.params.mail}, { password: password}, {new: true });
    res.redirect(`/companyWorker/homePage/${req.params.mail}`);
}

//כל יום יבדוק אם יש שגיאת דיווח

cron.schedule("0 8 * * *", ()=> {
    var d=new Date();
    console.log("cron reportCheck");
    //addMessage("ravit@gmail.com",d,"EmptyShift","sdds");

   reportCheck();
    //reportCheck2();

});

//מייל ובעיה
const reportCheck = async () => {
try {
    console.log('employements');
    var i ;
    var startHour ;
    var startMin ;
    var endHour ;
    var endMin ;
    var sum = 0;
    let employements = await Employement.find();
    for (i = 0; i < employements.length; i++) {

        if (employements[i].startTime == "0" || employements[i].endTime == "0")
        {
            addMessage(employements[i].constructorEmail, employements[i].date, "EmptyShift", "Welcome!!\nReported incorrectly / did not report at all !!\nPlease fix ",employements[i].jobScope,employements[i].startTime,employements[i].endTime,employements[i]._id);
        }
        else {
            const [h, m, s] = employements[i].startTime.split(':');
            console.log('split :' + h + m + 's');
            startHour = parseInt(h, 10);
            startMin = parseInt(m, 10);
            const [h2, m2, s2] = employements[i].endTime.split(':');
            console.log('split :' + h2 + m2 + 's');
            endHour = parseInt(h2, 10);
            endMin = parseInt(m2, 10);

            sum = (endHour * 60 - startHour * 60) + Math.abs(endMin - startMin);
            sum = sum / 60;
            console.log(sum);
            if (employements[i].jobScope != sum) {
                addMessage(employements[i].constructorEmail, employements[i].date, "ErrorReported", "Hello!!\nThe hours you reported do not match the hours your employer approved for you !!\n Error is: "+ sum + ".", employements[i].jobScope, employements[i].startTime, employements[i].endTime,employements[i]._id);
            }
        }
        console.log(employements[i].constructorEmail);
    }
}
catch(err) {
    console.log(err);
}
}

// const reportCheck2 = async () => {
//     var str = '2:12:46';
//     var str2 = '4:00:46';
//
//     const [h, m, s] = str.split(':');
//     console.log('split :' +h +m +'s');
//     var startHour = parseInt(h, 10);
//     var startMin = parseInt(m, 10);
//     const [h2, m2, s2] = str2.split(':');
//     console.log('split :' +h2 +m2 +'s');
//     var endHour = parseInt(h2, 10);
//     var endMin = parseInt(m2, 10);
//
//     var sum = (endHour*60 - startHour*60) + Math.abs(endMin - startMin);
//     console.log('sum ' +sum);
//
// }


const addMessage= (mail,date,type,text,js,s,e,id) => {
    try {

       // var d=new Date('2021-06-06T12:28:49.684Z');
        const newCompanyMessage = new CompanyMessage({employmentId:id,contractorMail: mail, date: date, type: type, text: text,jobScope:js,startTime:s,endTime:e});
        newCompanyMessage.save().then(messages => {
            console.log(messages);
        }).catch(err => {
            console.log(`can not add this message! ${err}`);
        });
    }
    catch(err) {
        console.log(err);
    }
}

/*########*/
const messageList =  async (req,res) => {
    console.log('messageList1');
    try {
        console.log('messageList2');
        let messages = await CompanyMessage.find();
        if (messages) {
            // {contractorMail:req.params.mail}
            //עובד שזה המייל שלו
            let employment = await Employement.find();
            messages.sort((a, b) => b.date - a.date)
            console.log('messageList3');

            res.render('../views/companyMessageFromSystem', {message: messages,mail:req.params.mail});
        } else {
            return res.status(400).send('That email is error!');
        }
    }
    catch(err) {
        console.log(err);
    }
}

//עדכון שדות בהודעה
const upDateTime = async (req,res) => {

    let employment = await Employement.findByIdAndUpdate({_id: req.body.id},{startTime: req.body.startTime,endTime: req.body.endTime});
    res.redirect(`/companyWorker/homePage/${req.params.mail}`);
    //console.log('infoCompanyWorker1/1');
    //infoCompanyWorker();
    //console.log('infoCompanyWorker1/2');
}
module.exports = { addCompanyWorker,companyExists,deleteCompanyWorkerById,getCompanyWorkerByEmail,editProfileDisplay,editProfile,updateCompanyWorkerPass,searchContractorByFields,bookContractor,bookContractorDisplay,allEmployer,allCompany,infoCompany,infoCompanyWorker,resetPasswordDisplay,resetPassword,messageList,addMessage,upDateTime};
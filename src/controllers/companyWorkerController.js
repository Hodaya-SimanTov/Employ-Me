const nodeMailer=require('nodemailer')
const CompanyWorker = require('../model/companyWorker')


const addCompanyWorker=(req,res)=>{
    const newComapnyWorker=new CompanyWorker(req.body)
    newComapnyWorker.save().then(companyWorker =>{
        //sendmail(contractorWorker.mail,contractorWorker.firstName)//שולח מייל בהרשמה
        res.send('success to add db')
        console.log('succ');
    }).catch(err=>{
        console.log(`can not add this worker! ${err}`);
    })
}
/*
const deleteCompanyWorker=(req,res)=>{
    CompanyWorker.deleteOne({mail: req.params.mail }).then(companyWorker=>{
        res.send("success to dalete")
    }).catch(err=>{
        console.log(`can not delete this worker! ${err}`);
    })
}
 */
module.exports={addCompanyWorker}
const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken');
const ContractorWorker=require('../model/contractorWorker');
const Unavailability=require('../model/unavailabilityContractor');
//const bcrypt = require('bcrypt');
const { CompanyWorker, validate,validateEditCompanyWorker } = require('../model/companyWorker');
//const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

//הוספת עובדי משאבי אנוש
const addCompanyWorker=(req,res)=>{
    if(companyExists(req.body.mail)==false){
        console.log(req.body);
    const newComapnyWorker=new CompanyWorker(req.body)
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(req.body.mail).toLowerCase()))
            console.log('no succ');
        else
        {
            newComapnyWorker.save().then(companyWorker =>{
            res.send('success to add db')
        console.log('succ');
    }).catch(err=>{
        console.log(`can not add this worker! ${err}`);
    })
}
        }
    else{
        console.log("exists!!");
    }
}

const companyExists=(mail)=>{
    CompanyWorker.findOne({ mail:mail }).then(CompanyWorker=>{
        console.log("exists");
        return true;
    }).catch(err=>{
        console.log("not exists!!");
        return false;
    })
}
//מחיקת עובד משאבי אנוש
const deleteCompanyWorkerById=(req,res)=>{
    CompanyWorker.findByIdAndDelete(req.params.id).then(CompanyWorker=>{
        res.send("success to dalete")
    }).catch(err=>{
        console.log(`can not delete this worker! ${err}`);
    })
}
//עובד חברה לפי מייל
const getCompanyWorkerByEmail=async(mail)=>{

    let companyWorker = await CompanyWorker.findOne({mail:req.params.mail})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',{companyWorker})
    }
    else {
        return res.status(400).send('That mail is error!');
    }
}
//סיסמא
const resetPassword=async (req, res) =>{
    const { mail } = req.body.mail
    const name=req.body.firstName
    let randomstring = Math.random().toString(36).slice(-8)
    const salt = await bcrypt.genSalt(10);
    let password= await bcrypt.hash(randomstring, salt);
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
//הצגת פרופיל
const editProfileDisplay=async (req, res) => {
    let companyWorker = await CompanyWorker.findOne({mail:req.params.mail})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',{companyWorker:companyWorker});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
//עריכת פרופיל
const editProfile=async (req, res) => {
    let companyWorker= await CompanyWorker.findOneAndUpdate({mail: req.params.mail}, req.body, {new: true });
    res.redirect(`/companyWorker/homePage/${req.params.mail}`);


}

const updateCompanyWorkerPass=(req,res)=>{
    console.log(`in update pass`);
    CompanyWorker.findOneAndUpdate({mail: req.params.mail}, {password: req.body.password})
        .then(companyWorker=>{
            console.log(req.body.password);
            console.log(req.body.mail);
            res.redirect(`/companyWorker/homePage/${req.params.mail}`);
        }).catch(err=>{
        console.log(`can not update this paa! ${err}`);
    })

}

module.exports={addCompanyWorker,companyExists,deleteCompanyWorkerById,getCompanyWorkerByEmail,resetPassword,editProfileDisplay,editProfile,updateCompanyWorkerPass}
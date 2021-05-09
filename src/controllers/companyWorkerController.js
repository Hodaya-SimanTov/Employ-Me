const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken');
const ContractorWorker=require('../model/contractorWorker');
const Unavailability=require('../model/unavailabilityContractor');
const bcrypt = require('bcrypt');
const { CompanyWorker, validate,validateEditCompanyWorker } = require('../model/companyWorker');
//const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

//הוספת עובדי משאבי אנוש
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
//מחיקת עובד משאבי אנוש
const deleteCompanyWorkerById=(req,res)=>{
    CompanyWorker.findByIdAndDelete(req.params.id).then(CompanyWorker=>{
        res.send("success to dalete")
    }).catch(err=>{
        console.log(`can not delete this worker! ${err}`);
    })
}
//עובד חברה לפי מייל
const getCompanyWorkerByEmail=async(email)=>{

    let companyWorker = await CompanyWorker.findOne({email:req.params.email})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',{companyWorker})
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
//סיסמא
const resetPassword=async (req, res) =>{
    const { email } = req.body.email
    const name=req.body.firstName
    let randomstring = Math.random().toString(36).slice(-8)
    const salt = await bcrypt.genSalt(10);
    let password= await bcrypt.hash(randomstring, salt);
    let companyWorker = await CompanyWorker.findOne({ email: req.body.email }).then(companyWorker=>{
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
    let companyWorker = await CompanyWorker.findOne({email:req.params.email})
    if (companyWorker) {
        res.render('../views/companyWorkerEditProfile',companyWorker);
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
//עריכת פרופיל
const editProfile=async (req, res) => {
    const { error } = validateEditCompanyWorker(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let companyWorker= await CompanyWorker.findOneAndUpdate({email: req.params.email}, req.body, {new: true });
    res.redirect('/companyWorker/homePage');
}
module.exports={addCompanyWorker,deleteCompanyWorkerById,getCompanyWorkerByEmail,resetPassword,editProfileDisplay,editProfile}
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const {ContractorWorker} = require('../model/contractorWorker');
const ContractorWorkeController = require('../controllers/contractorWorkerController');
const Unavailability = require('../model/unavailabilityContractor');
const bcrypt = require('bcrypt');
const { Employer, validate,validateEditEmployer } = require('../model/employer');
const {Employement, validateEmployement} = require('../model/employement');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectId } = require('bson');


const addEmployer = async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let employer = await Employer.findOne({ email: req.body.email });
    if (employer) {
        return res.redirect('/employer/employerExists')
    } 
    else {
        // Insert the new user if they do not exist yet
        employer = new Employer(_.pick(req.body, ['firstName', 'lastName', 'phone', 'email', 'companyName', 'password', 'role']));
        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(employer.password, salt);
        await employer.save();
        res.redirect(`/employer/homePage/${employer.email}`);
    }
    // console.log('I am in add employer')
}

const getEmployerByEmail = async(email) => {
    
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/employerEditProfile', {employer})
    } 
    else {
        return res.status(400).send('That email is error!');
    }
   
}
const editProfileDisplay = async (req, res) => {
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/employerEditProfile', employer);
    } 
    else {
        return res.status(400).send('That email is error!');
    }
}
const editProfile = async (req, res) => {
    const { error } = validateEditEmployer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let employer = await Employer.findOneAndUpdate({email: req.params.email}, req.body, {new: true });
    res.redirect(`/employer/homePage/${req.params.email}`);
}
const resetPasswordDisplay = async (req, res) => {
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/resetPasswordEmployer', employer);
    } 
    else {
        return res.status(400).send('That email is error!');
    }
}
const resetPassword = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    let employer = await Employer.findOneAndUpdate({email: req.params.email}, { password: password}, {new: true });
    res.redirect(`/employer/homePage/${req.params.email}`);
}
//פונקציה שמחזירה עובדים שתפוסים בין 2 תאריכים
const ContractorAvialableDate = async(date) => {
    var array = [];
    var i = 0;
    const d = new Date(date)
    const myDate = new Date(d.getFullYear(), d.getMonth(), d.getUTCDate() + 1)
    var unavailability = await Unavailability.find( {unavailabArray : { $nin: [myDate] }});        
    for(i = 0; i<unavailability.length; i++) {
        array[i] = unavailability[i].contractorId;
    }
    return array;  
}
// const findContractorInSpecDate=(req,res)=>{
//         var array=[];
//         var i=0;
//         Unavailability.find( {unavailabArray : { $in: [req.body.date] }}).then(unavailability=>{  
//             res.send({contractors:unavailability});        
//             for(i=0;i<unavailability.length;i++){
//                 array[i]=unavailability[i].contractorId;
//             }
//             console.log(array);    
//             return array;  
//         }).catch(err=>{
//             console.log(err);
//         })
//     }
 

//  פונקציה שמחזירה עובדים שעומדים בסינונים ופנויים בתאריך
const searchContractorByFields = async(req, res) => {
    const avilableConsArr = await ContractorAvialableDate(req.body.employmentDate);
    var result;
    var filteredCons = [];
    if(req.body.service == 'select') {
        if(req.body.scope == 'select') {
            if(req.body.experience == 'select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea: req.body.occupation})
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, experienceField:req.body.experience})
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
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
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
                }
                catch(err) {
                    console.log(err);
                }        
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, scopeWork:req.body.scope, experienceField:req.body.experience})
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
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
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
                }
                catch(err) {
                    console.log(err);
                }         
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, experienceField:req.body.experience})
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerSearchResult', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
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
                    result = await availableCons(avilableConsArr,filteredCons);
                    res.render('../views/employerSearchResult',{result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
                }
                catch(err) {
                    console.log(err);
                }       
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, scopeWork:req.body.scope, experienceField:req.body.experience})
                    result = await availableCons(avilableConsArr, filteredCons);
                    res.render('../views/employerHomePage', {result:result, emailEmployer: req.params.email, date: req.body.employmentDate});
                }
                catch(err) {
                    console.log(err);
                }            
            }
        }
    }
    
}

// const addEmployemnt=async (req, res) => {
//     const { error } = validateEmployement(req.body);
//     if (error) {
//         return res.status(400).send(error.details[0].message);
//     }
//     employement = new Employement(_.pick(req.body, ['employerEmail','constructorEmail','date', 'jobScope','status','hourlyWage','rating','feedback']));
//     await employement.save();
//     res.redirect('/employer/homePage');
// }
//פונקציה שמקבלת 2 מערכים אחד של הקונטרקטורים שזמינים בתאריך מסויים ואחד של הקונטרקטורים שמתאימים לסינון ומחזירה מערך של קונטרקטורים שמתאימים 
const availableCons = (avilableConsArr, filteredConsArr) => {
    var availableCons = [];
    for (let i = 0; i<avilableConsArr.length; i++) {
        for (let j = 0; j<filteredConsArr.length; j++) {
            if (String(filteredConsArr[j]._id) === String(avilableConsArr[i])) {
                availableCons.push(filteredConsArr[j]);
            }
        }
    }
    return availableCons;
}
const bookContractorDisplay = async (req, res) => {
    let contractor = await ContractorWorker.findById(req.params.idConstractor)
    let employer = await Employer.findOne({email: req.params.emailEmployer})
    if (!contractor || !employer) {
        return res.status(400).send('That error in system');
    } 
    else {
        res.render('../views/bookContractor', {contractor: contractor,emailEmployer: req.params.emailEmployer, date: req.params.date, companyName: employer.companyName});
    }
}
const bookContractor = async (req, res) => {
    let contractor = await ContractorWorker.findById(req.params.idConstractor)
    let employer = await Employer.findOne({email: req.params.emailEmployer})
    if (!contractor || !employer) {
        return res.status(400).send('That error in system');
    } 
    else {
        let employement = new Employement({employerEmail: req.params.emailEmployer, constructorEmail: contractor.mail, date: req.params.date, jobScope: req.body.numBusinessHours, status: 'waiting for approval',hourlyWage: contractor.hourlyWage, rating: 0, feedback:'',occupationArea: contractor.occupationArea});
        await employement.save();
        // console.log({id: contractor.unavailability,date:req.params.date})
        // ContractorWorkeController.addDateToUnavailabilityarray(contractor.unavailability, req.params.date,req.params.date);
        res.redirect(`/employer/homePage/${req.params.emailEmployer}`);
    }
}
const confirmEmploymentsDisplay = async (req, res) => {
    try {
        let cEmployment = await Employement.find({employerEmail: req.params.email, status:'verified‏'});
        res.render('../views/employerConfirmEmployments', {cEmployment:cEmployment, emailEmployer: req.params.email});
    }
    catch(err) {
        console.log(err);
    }    
}
const confirmEmployments = async (req, res) => {
    try {
        
        let cEmployment = await Employement.findOneAndUpdate({_id: ObjectId(req.params.id)}, {status:'close',rating: req.body.myRate,feedback:req.body.description }, {new: true });
        cEmployment.sort((a, b) => a.date - b.date);
        res.redirect(`/employer/confirmEmployments/${req.body.employerEmail}`);
    }
    catch(err) {
        console.log(err);
    }    
}
const terminationOfEmploymentDisplay=async(req,res)=>{
    let cEmployment = await Employement.findById(req.params.id);
    let contractor =  await ContractorWorker.findOne({mail: cEmployment.constructorEmail});

    res.render('../views/employerTerminationOfEmployment',{employement: cEmployment,contractor:contractor});
}
const historyEmployments = async (req, res) => {
    try {
        let hEmployment = await Employement.find({employerEmail: req.params.email, status:'close'})
        hEmployment.sort((a, b) => b.date - a.date);
        res.render('../views/employerHistory', {hEmployment:hEmployment,emailEmployer: req.params.email});
    }
    catch(err) {
        console.log(err);
    }    
}
const futureEmployement = async (req,res) => {
    try {
        let fEmployment = await Employement.find({employerEmail: req.params.email, status: {$in: ['canceled‏','waiting for approval','approved‏']}});
        fEmployment.sort((a, b) => a.date - b.date);
        res.render('../views/employerFutureEmployement', {fEmployment:fEmployment,emailEmployer: req.params.email});
    }
    catch(err) {
        console.log(err);
    }
}
// const rateAndFidback=async (req, res) => {
//     let rEployment=await Employement.findOne({employerEmail: req.params.emailEmployer, idConstractor: req.params.idConstractor, date: req.params.date})
//>וספות של כנרת למועדפים

const addFavoriteConToArray = async (req, res) => {
    try {
        let employerFav = await Employer.findOneAndUpdate({email: req.params.email}, {$addToSet:{'favoritesArray': req.params.id}}, {new: true });
        console.log(employerFav);
        res.redirect(`/employer/homePage/${req.params.email}`);
    }
    catch(err) {
        console.log(err);
    }   
    // Employer.findOneAndUpdate(req.params.email, {$addToSet:{'favoritesArray': req.params.id}})
    //     .then(() => {
    //         console.log("Add favorite contractor to employer");
    //     }).catch(err => {
    //     console.log(err);
    // })
    // res.redirect(`/employer/homePage/${req.params.email}`);
}

module.exports = {addEmployer,getEmployerByEmail,editProfileDisplay,editProfile,searchContractorByFields,ContractorAvialableDate,availableCons,resetPassword,resetPasswordDisplay,bookContractorDisplay,bookContractor,confirmEmploymentsDisplay,historyEmployments,confirmEmployments,terminationOfEmploymentDisplay,addFavoriteConToArray,futureEmployement};



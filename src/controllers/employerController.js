const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken');
const ContractorWorker=require('../model/contractorWorker');
const Unavailability=require('../model/unavailabilityContractor');
const bcrypt = require('bcrypt');
const { Employer, validate,validateEditEmployer } = require('../model/employer');
const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const addEmployer=async (req, res) => {
    console.log(req.body);
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let employer = await Employer.findOne({ email: req.body.email });
    if (employer) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        employer = new Employer(_.pick(req.body, ['firstName','lastName','phone', 'email','companyName','password','role']));
        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(employer.password, salt);
        await employer.save();
        //const token = jwt.sign({ _id: employer._id }, config.get('PrivateKey'));
        //res.header('x-auth-token', token).send(_.pick(employer, ['_id','firstName','lastName','phone', 'email','companyName','rule']));
        //res.send(_.pick(employer, ['_id','firstName','lastName','phone', 'email','companyName','rule']));
    
        res.redirect('/employer/homePage');
    }
    // console.log('I am in add employer')
}

const getEmployerByEmail=async(email)=>{
    
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/employerEditProfile',{employer})
    } 
    else {
        return res.status(400).send('That email is error!');
    }
   
}
const editProfileDisplay=async (req, res) => {
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/employerEditProfile',employer);
    } 
    else {
        return res.status(400).send('That email is error!');
    }
}
const editProfile=async (req, res) => {
    const { error } = validateEditEmployer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let employer= await Employer.findOneAndUpdate({email: req.params.email}, req.body, {new: true });
    res.redirect('/employer/homePage');
}
const resetPasswordDisplay=async (req, res) => {
    let employer = await Employer.findOne({email:req.params.email})
    if (employer) {
       res.render('../views/resetPasswordEmployer',employer);
    } 
    else {
        return res.status(400).send('That email is error!');
    }
}
const resetPassword=async (req, res) =>{

    const salt = await bcrypt.genSalt(10);
    const password= await bcrypt.hash(req.body.password, salt);
    let employer= await Employer.findOneAndUpdate({email: req.params.email}, { password: password}, {new: true });
    res.redirect('/employer/homePage');
}
//פונקציה שמחזירה עובדים שתפוסים בין 2 תאריכים
const ContractorAvialableDate=async(date)=>{
    var array=[];
    var i=0;
    var unavailability = await Unavailability.find( {unavailabArray : { $nin: [date] }}); 
        //res.send({contractors:unavailability});        
    for(i=0;i<unavailability.length;i++){
        array.push(unavailability[i].contractorId);
    }
    return array;  
}


//  פונקציה שמחזירה עובדים שעומדים בסינונים ופנויים בתאריך
const searchContractorByFields=async(req,res)=> {
    console.log(req.body);
    const avilableConsArr=await ContractorAvialableDate(req.body.employmentDate);
    var result;
    var filteredCons=[];
    if(req.body.service=='select')
    {
        if(req.body.scope=='select')
        {
            if(req.body.experience=='select')
            {
                try{
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation})
                    console.log("filter1");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    
                    //res.send(result)
                }
                catch(err){
                    console.log(err);
                }
            }
            else{
                try{
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, experienceField:req.body.experience})
                    console.log("filter2");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }  
            }
        }
        else{
            if(req.body.experience=='Select')
            {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, scopeWork:req.body.scope})
                    console.log("filter3");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }        
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation ,scopeWork:req.body.scope, experienceField:req.body.experience})
                    console.log("filter4");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }     
            }
        }
    }
    else{
        if(req.body.scope=='Select')
        {
            if(req.body.experience=='Select') {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation ,serviceArea:req.body.service})
                    console.log("filter5");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }         
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, experienceField:req.body.experience})
                    console.log("filter6");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }             
            }
        }
        else{
            if(req.body.experience=='Select'){
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, scopeWork:req.body.scope})
                    console.log("filter7");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }       
            }
            else {
                try {
                    filteredCons = await ContractorWorker.find( {occupationArea:req.body.occupation, serviceArea:req.body.service, scopeWork:req.body.scope, experienceField:req.body.experience})
                    console.log("filter8");
                    result = await availableCons(avilableConsArr,filteredCons);
                    console.log(result+"i result");
                    res.send(result)
                }
                catch(err){
                    console.log(err);
                }            
            }
        }
    }
    console.log(result);
    res.render('../views/employerSearchResult',{result});
}

const addEmployemnt=async (req, res) => {
    const { error } = validateEmployement(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    employement = new Employement(_.pick(req.body, ['employerEmail','constructorEmail','date', 'jobScope','status','hourlyWage','rating','feedback']));
    await employement.save();
    res.redirect('/employer/homePage');
}
//פונקציה שמקבלת 2 מערכים אחד של הקונטרקטורים שזמינים בתאריך מסויים ואחד של הקונטרקטורים שמתאימים לסינון ומחזירה מערך של קונטרקטורים שמתאימים 
const availableCons=(avilableConsArr,filteredConsArr)=>{
    var availableCons=[];
    console.log(avilableConsArr+"i idesss")
    console.log(filteredConsArr+"i objects")
    for(let i=0; i<avilableConsArr.length; i++)
    {
        for (let j=0; j<filteredConsArr.length; j++)
        {
            if(String(filteredConsArr[j]._id) === String(avilableConsArr[i])) {
                availableCons.push(filteredConsArr[j]);
            }
        }
    }
    console.log(availableCons)
    return availableCons;
}


module.exports={addEmployer,getEmployerByEmail,editProfileDisplay,editProfile,searchContractorByFields,ContractorAvialableDate,availableCons,resetPassword,addEmployemnt,resetPasswordDisplay};


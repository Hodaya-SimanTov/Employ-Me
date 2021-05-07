const nodemailer=require('nodemailer')

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { Employer, validate,validateEditEmployer } = require('../model/employer');

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
const resetPassword=async (req, res) =>{
    const { email } = req.body.email
    const name=req.body.firstName
    let randomstring = Math.random().toString(36).slice(-8)
    // try {
            const salt = await bcrypt.genSalt(10);
            let password= await bcrypt.hash(randomstring, salt);
            let employer = await Employer.findOne({ email: req.body.email }).then(employer=>{
            employer.password=password
            employer.markModified('password')
            employer.save(err => console.log(err))
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

        // res.status(200).json({ user: user._id })
        //return user
    // }
    // catch (err) {
    //     const errors = handleErrors(err)
    //     res.status(400).json({ errors })
    // }
}


module.exports={addEmployer,getEmployerByEmail,editProfileDisplay,editProfile,resetPassword};

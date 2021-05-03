const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { Employer, validate } = require('../model/employer');
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
    console.log('I am in add employer')
}

module.exports={addEmployer}
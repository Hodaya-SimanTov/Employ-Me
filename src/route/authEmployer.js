const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Employer } = require('../model/employer');
const express = require('express');
const router = express.Router();
//const config = require('config');

router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  Now find the user by their email address
    let employer = await Employer.findOne({ email: req.body.email });
    if (!employer) {
        return res.status(400).send('Incorrect email or password.');
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, employer.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }
   // const token = jwt.sign({ _id: employer._id }, config.get('PrivateKey'));
    const token = jwt.sign({ _id: employer._id }, 'PrivateKey');
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(100).required().email(),
        password: Joi.string().min(6).max(128).required()
    });

    return schema.validate(req);
}

module.exports = router; 
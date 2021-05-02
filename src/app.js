const express = require('express')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
const bodyParser=require('body-parser')

const mongoose=require('mongoose')

const apiEmployer=require('./route/apiEmployer')
const apiContractorWorker=require('./route/apiContractorWorker')
const apiCompanyWorker=require('./route/apiCompanyWorker')

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
//const authEmployer = require('./route/authEmployer');
app.use(bodyParser.json());
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.CONNECT_DB, {connectionParams})
    .then(()=>{
        console.log('connected');

    }).catch((err) =>{
        console.log(`error connecting ${err}`);
})

app.use(express.json());
app.use(express.static('public'))
app.set('view engine','ejs')

//app.use(express.urlencoded({extended:false}))

app.use('/employer',apiEmployer)
app.use('/contractorWorker',apiContractorWorker)
app.use('/companyWorker',apiCompanyWorker)


// app.use('/api/authEmployer', authEmployer);

const port = process.env.PORT 
app.listen(port,()=>{
    console.log(`server is up and running at: http://127.0.0.1:${port}` )
})


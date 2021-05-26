const express = require('express')
const app = express()
const path=require('path');
const dotenv=require('dotenv')
const isProd = process.env.APP_ENV === 'prod'
if(!isProd)
    dotenv.config({path:'.env'})
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const apiEmployer = require('./route/apiEmployer');
const apiContractorWorker = require('./route/apiContractorWorker');
const apiCompanyWorker = require('./route/apiCompanyWorker');


const Joi = require('joi');
const { date } = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
//const authEmployer = require('./route/authEmployer');

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'))
app.set('view engine', 'ejs')



const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose.connect(process.env.CONNECT_DB, connectionParams)
    .then(() => {
        console.log('connected');

    }).catch((err) => {
        console.log(`error connecting ${err}`);
})
app.get('/', (req,res) => {
    res.render('homePage1');
});

app.use(express.json());
//app.use(express.urlencoded({extend:false}));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/imgages', express.static(__dirname + 'public/imgages'));

app.get('/', (req,res) => {
    res.render('contractorSignUp');        
});
app.use('/employer', apiEmployer);
app.use('/contractorWorker', apiContractorWorker);
app.use('/companyWorker', apiCompanyWorker);


// const port = process.env.PORT
const port =  process.env.PORT || 4000
app.listen(port, () => {    
    console.log(`\nserver is up and running at: http://127.0.0.1:${port}\n` )
})


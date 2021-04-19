const express = require('express')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const router=require('./route/api')

app.use(bodyParser.json());

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

mongoose.connect(process.env.CONNECT_DB, {connectionParams})
    .then(()=>{
        console.log("connected");

    }).catch((err) =>{
        console.log(`error connecting ${err}`);
})

app.use('/',router)

const port = process.env.PORT 
app.use(express.static('public'))
app.set('view engine','ejs')

app.listen(port,()=>{
    console.log(`server is up and running at: http://127.0.0.1:${port}` )
})


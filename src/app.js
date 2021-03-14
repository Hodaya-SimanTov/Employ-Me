const express = require('express')
var appController=require('./controllers/appController')
const port = process.env.PORT || 4000
const app = express()
app.set('view engine','ejs')
app.use(express.static('public'))

//app controller
appController(app)


app.get('/profile/:name',(req,res)=>{
    res.send('welcome to my profile whit name of user  '+req.params.name)
})
app.listen(port,()=>{
console.log(`server is up and running at: http://127.0.0.1:${port}` )
})


const exspress = require('express')
const port = process.env.PORT || 4000
const app = exspress()
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/login.html')
})
app.get('/profile',(req,res)=>{
    res.send('welcome to my profile')
})
app.get('/profile/:name',(req,res)=>{
    res.send('welcome to my profile whit name of user  '+req.params.name)
})
app.listen(port,()=>{
console.log(`server is up and running at: http://127.0.0.1:${port}` )
})


const exspress = require('express')
const port = process.env.PORT || 4000
const app = exspress()
app.get('/',(req,res)=>{
    res.send('Hello world')
})
app.get('/profile',(req,res)=>{
    res.send('welcome to my profile')
})
app.listen(port,()=>{
console.log(`server is up and running at: http://127.0.0.1:${port}` )
})




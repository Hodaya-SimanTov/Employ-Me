const router=require('express').Router()
const employer=require('../controllers/employerController')

router.post('/addEmployer',(employer.addEmployer))

router.get('/signUp',(req,res)=>{
    res.render('../views/signUpEmployer')
});

module.exports=router



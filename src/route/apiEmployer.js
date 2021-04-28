const router=require('express').Router()
const employer=require('../controllers/employerController')

router.post('/addEmployer',(employer.addEmployer))

router.get('/signUp',(req,res)=>{
    res.render('../views/employerSignUp1')
});
router.get('/homePage',(req,res)=>{
    res.render('../views/employerHomePage')
});
router.get('/editProfile',(req,res)=>{
    res.render('../views/employerEditProfile')
});

module.exports=router



const router=require('express').Router()
const employer=require('../controllers/employerController')

//router.post('/addEmployer',employer.addEmployer)
router.post('/addEmployer',(req,res)=>{
    res.render('../views/employerHomePage')
});


router.get('/signUp',(req,res)=>{
    res.render('../views/employerSignUp1')
});
router.get('/homePage',(req,res)=>{
    res.render('../views/employerHomePage')
});
router.get('/editProfile',(req,res)=>{
    res.render('../views/employerEditProfile')
});
router.get('/search',(req,res)=>{
    res.render('../views/employerSearch')
});

module.exports=router



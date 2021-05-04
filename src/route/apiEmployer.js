const router=require('express').Router()
const employer=require('../controllers/employerController')

//router.post('/addEmployer',employer.addEmployer)
router.post('/addEmployer',(req,res)=>{
    res.render('../views/employerHomePage')
});

// router.get('/getEmployerByEmail/:email',employer.getEmployerByEmail);

router.get('/signUp',(req,res)=>{
    res.render('../views/employerSignUp1')
});
router.get('/homePage',(req,res)=>{
    res.render('../views/employerHomePage')
});



router.get('/editProfile/:email',employer.editProfileDisplay);
router.post('/editProfile/:email',employer.editProfile);


router.get('/search',(req,res)=>{
    res.render('../views/employerSearch')
});

module.exports=router



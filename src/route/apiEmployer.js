const router=require('express').Router()
const employer=require('../controllers/employerController')

//router.post('/addEmployer',employer.addEmployer)
router.post('/addEmployer',(req,res)=>{
    res.render('../views/employerHomePage')
});

router.get('/getEmployerByEmail/:email',employer.getEmployerByEmail);

router.get('/signUp',(req,res)=>{
    res.render('../views/employerSignUp1')
});
router.get('/homePage',(req,res)=>{
    res.render('../views/employerHomePage')
});
<<<<<<< HEAD
router.get('/editProfile/:email',employer.editProfileDisplay);
router.post('/editProfile/:email',employer.editProfile);
router.post('/example',(req,res)=>{
    res.render('../views/sign_up')
})
=======
router.get('/editProfile',(req,res)=>{
    res.render('../views/employerEditProfile')
});
router.get('/search',(req,res)=>{
    res.render('../views/employerSearch')
});

>>>>>>> c19e33e0830956dfdc69d170b5255bc2c4fd2128
module.exports=router



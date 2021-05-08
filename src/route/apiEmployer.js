const router=require('express').Router()
const employer=require('../controllers/employerController')

router.post('/addEmployer',employer.addEmployer)
// router.post('/addEmployer',(req,res)=>{
//     res.render('../views/employerHomePage')
// });

// router.get('/getEmployerByEmail/:email',employer.getEmployerByEmail);

router.get('/signUp',(req,res)=>{
    res.render('../views/employerSignUp1')
});
router.get('/homePage/:email',(req,res)=>{
    res.render('../views/employerHomePage')
});

router.get('/resetPassword/:email',employer.resetPasswordDisplay)
router.post('/resetPassword/:email',employer.resetPassword)
router.get('/editProfile/:email',employer.editProfileDisplay);
router.post('/editProfile/:email',employer.editProfile);
router.post('/addEmployement',employer.addEmployemnt)
router.get('/bookContractor/:emailEmployer/:idConstractor/:date',employer.bookContractorDisplay)
router.get('/search/:email',(req,res)=>{
    res.render('../views/employerSearch',{email: req.params.email})
});


//הוספות של כנרת לסינון
//router.get('/ContractorAvialableDate',employer.ContractorUnavialableDate);
router.post('/searchContractorByFields/:email',employer.searchContractorByFields);
//עד כאן
// router.get('/searchResult',(req,res)=>{
//     res.render('../views/employerSearchResults')
// });


module.exports=router



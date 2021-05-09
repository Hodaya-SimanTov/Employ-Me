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
    res.render('../views/employerHomePage',{email:req.params.email})
});

router.get('/resetPassword/:email',employer.resetPasswordDisplay)
router.post('/resetPassword/:email',employer.resetPassword)
router.get('/editProfile/:email',employer.editProfileDisplay);
router.post('/editProfile/:email',employer.editProfile);
//router.post('/addEmployement',employer.addEmployemnt)
router.get('/bookContractor/:emailEmployer/:idConstractor/:date',employer.bookContractorDisplay)
router.post('/bookContractor/:emailEmployer/:idConstractor/:date',employer.bookContractor)
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
// router.get('/confirmEmployments/:email',(req,res)=>{
//     res.render('../views/employerConfirmEmployments',{email: req.params.email})
// });
router.get('/confirmEmployments/:email',employer.confirmEmployments);
router.get('/employerHistory/:email',employer.historyEmployments);

//  router.get('/employerRate',(req,res)=>{
//     res.render('../views/employerRate')
// });

// router.post('/employerRate/:emailEmployer/:idConstractor/:date',employer.bookContractor);


module.exports=router



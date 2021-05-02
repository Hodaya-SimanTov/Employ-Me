const router=require('express').Router()

const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);
//router.delete('/deleteCompanyWorker/:mail\n',companyWorker.deleteCompanyWorker);

router.get('/editCompanyWorkerProfile',(req,res)=>{
    res.render('../views/companyWorkerEditProfile')
});
router.get('/CompanyWorkerHomePage',(req,res)=>{
    res.render('../views/CompanyWorkerHomePage')
});
//לא עובד
/*
router.post('/signUpFromCompanyWorker',(req,res)=>{
    res.render('../views/employerSignUp1')
});
 */


module.exports=router

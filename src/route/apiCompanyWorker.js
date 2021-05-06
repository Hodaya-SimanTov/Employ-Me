const router=require('express').Router()

const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);
//router.delete('/deleteCompanyWorker/:mail\n',companyWorker.deleteCompanyWorker);
/*
router.get('/editCompanyWorkerProfile',(req,res)=>{
    res.render('../views/companyWorkerEditProfile')
});
*/
router.get('/companyWorkerSignUp',(req,res)=>{
    res.render('../views/companyWorkerSignUp')
});
router.get('/companyWorkerHomePage',(req,res)=>{
    res.render('../views/companyWorkerHomePage')
});

//לא עובד
/*
router.post('/signUpFromCompanyWorker',(req,res)=>{
    res.render('../views/employerSignUp1')
});
 */


module.exports=router

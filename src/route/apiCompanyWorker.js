const router=require('express').Router()

const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);

router.get('/editCompanyWorkerProfile',(req,res)=>{
    res.render('../views/employerEditProfile')
});
router.get('/CompanyWorkerHomePage',(req,res)=>{
    res.render('../views/CompanyWorkerHomePage')
});

module.exports=router

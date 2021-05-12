const router=require('express').Router()
const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);
router.delete('/deleteCompanyWorkerById/:id',companyWorker.deleteCompanyWorkerById);
router.post('/resetPassword',companyWorker.resetPassword);
router.get('/editProfile/:mail',companyWorker.editProfileDisplay);
router.post('/editProfile/:mail',companyWorker.editProfile);

router.get('/companyWorkerSignUp',(req,res)=>{
    res.render('../views/companyWorkerSignUp')
});

router.get('/homePage/:mail',(req,res)=>{
    res.render('../views/companyWorkerHomePage',{mail:req.params.mail})
});
router.get('/menuEmployers/:mail',(req,res)=>{
    res.render('../views/companyWorkerMenuEmployers',{mail:req.params.mail})
});
router.get('/menuContractorWorker/:mail',(req,res)=>{
    res.render('../views/companyWorkerMenuContractor',{mail:req.params.mail})
});
router.post('/updateCompanyWorkerPass/:mail',companyWorker.updateCompanyWorkerPass);
//router.patch('/updateContractorPass/:mail',contractorWorker.updateContractorPass);

module.exports=router

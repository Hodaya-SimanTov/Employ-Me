const router=require('express').Router()
const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);
router.delete('/deleteCompanyWorkerById/:id',companyWorker.deleteCompanyWorkerById);
router.post('/resetPassword',companyWorker.resetPassword);
router.get('/editProfile/:email',companyWorker.editProfileDisplay);
router.post('/editProfile/:email',companyWorker.editProfile);

router.get('/companyWorkerSignUp',(req,res)=>{
    res.render('../views/companyWorkerSignUp')
});

router.get('/homePage/:email',(req,res)=>{
    res.render('../views/companyWorkerHomePage',{email:req.params.email})
});
router.get('/menuEmployers/:email',(req,res)=>{
    res.render('../views/companyWorkerMenuEmployers',{email:req.params.email})
});
router.get('/menuContractorWorker/:email',(req,res)=>{
    res.render('../views/companyWorkerMenuContractor',{email:req.params.email})
});
module.exports=router

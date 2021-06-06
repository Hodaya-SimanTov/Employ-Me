const router=require('express').Router()
const companyWorker=require('../controllers/companyWorkerController')


router.post('/addCompanyWorker',companyWorker.addCompanyWorker);
router.delete('/deleteCompanyWorkerById/:id',companyWorker.deleteCompanyWorkerById);
//router.post('/resetPassword',companyWorker.resetPassword);
router.get('/editProfile/:mail',companyWorker.editProfileDisplay);
router.post('/editProfile/:mail',companyWorker.editProfile);

router.get('/companyWorkerSignUp',(req,res)=>{
    res.render('../views/companyWorkerSignUp')
});

router.get('/homePage/:mail',(req,res)=>{
    res.render('../views/companyWorkerHomePage',{mail:req.params.mail})
});
/*
router.get('/menuContractorWorker/:mail',(req,res)=>{
    res.render('../views/companyWorkerMenuContractor',{mail:req.params.mail})
});
*/
router.post('/updateCompanyWorkerPass/:mail',companyWorker.updateCompanyWorkerPass);
//router.patch('/updateContractorPass/:mail',contractorWorker.updateContractorPass);
//router.get('/info/:mail', companyWorker.infoCompanyWorker);

router.get('/search/:mail',(req, res) => {
    res.render('../views/companyWorkerSearch', {mail: req.params.mail});
});
router.post('/searchContractorByFields/:mail', companyWorker.searchContractorByFields);
router.get('/companyWorkerBookContractor/:idConstractor/:date', companyWorker.bookContractorDisplay);
router.post('/companyWorkerBookContractor/:idConstractor/:date', companyWorker.bookContractor);

router.get('/allEmployer/:mail',companyWorker.allEmployer);
router.get('/allCompany/:mail',companyWorker.allCompany);
router.get('/info/:mail', companyWorker.infoCompany);


router.get('/resetPassword/:mail', companyWorker.resetPasswordDisplay);
router.post('/resetPassword/:mail', companyWorker.resetPassword);

router.get('/companyMessageList/:mail',companyWorker.messageList);

module.exports=router

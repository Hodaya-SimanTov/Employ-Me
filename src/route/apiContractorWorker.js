const router=require('express').Router()

const contractorWorker=require('../controllers/contractorWorkerController')


// router.get('/contractorHomepage',(req,res)=>{
//     res.render('contractorHomepage')        
// });
router.get('/homepage',(req,res)=>{
    res.render('homepage1')        
});
router.get('/contractorSignUp',(req,res)=>{
    res.render('contractorSignUp')        
});
router.get('/login',(req,res)=>{
    res.render('login')        
});
router.get('/notLogin',(req,res)=>{
    res.render('notLogin')        
});
router.get('/contractorExists',(req,res)=>{
    res.render('contractorExists')        
});



router.post('/addContractorWorker',contractorWorker.addContractorWorker);
router.get('/getContractorWorkerById/:id',contractorWorker.getContractorWorkerById);
router.get('/getContractorWorkerByMail/:mail',contractorWorker.getContractorWorkerByMail);
router.get('/getAllContractorWorkers',contractorWorker.getAllContractorWorkers);
router.delete('/deleteContractorWorkerById/:id',contractorWorker.deleteContractorWorkerById);
router.get('/loginUser/:mail',contractorWorker.loginUser);

router.get('/contractorProfile/:mail',contractorWorker.editProfileDisplay);
router.post('/contractorProfile/:mail',contractorWorker.editProfile);

router.post('/updateContractorPass/:mail',contractorWorker.updateContractorPass);
//router.patch('/updateContractorPass/:mail',contractorWorker.updateContractorPass);


router.get('/contractorUnavailability/:mail',contractorWorker.unDisplay);
router.post('/addUn/:mail',contractorWorker.addUn);

router.get('/contractorHomepage/:mail',contractorWorker.homepageDisplay);

router.post('/login',contractorWorker.loginUser);

router.get('/findContractorInSpecDate',contractorWorker.findContractorInSpecDate);

router.get('/contractorFuture/:mail',contractorWorker.contractorFuture);
router.get('/contractorHistory/:mail',contractorWorker.contractorHistory);
router.get('/contractorWaitApproval/:mail',contractorWorker.contractorWaitApproval);

router.get('/endEmployement/:id',contractorWorker.endEmployement);
router.get('/startEmployement/:id',contractorWorker.startEmployement);

router.get('/approveShift/:id',contractorWorker.approveShift);
router.get('/cancelShift/:id',contractorWorker.cancelShift);

router.get('/contractorPaycheckList/:mail',contractorWorker.payChecksList);
router.get('/contractorPayChecks/:mail/:month',contractorWorker.payCheck);

router.get('/contractorMessageList/:mail',contractorWorker.messageList);
router.post('/sendMessage/:mail',contractorWorker.sendMessage);
router.get('/sendMessageDiplay/:mail',contractorWorker.sendMessageDiplay);

module.exports=router


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


router.post('/addContractorWorker',contractorWorker.addContractorWorker);
router.get('/getContractorWorkerById/:id',contractorWorker.getContractorWorkerById);
router.get('/getContractorWorkerByMail/:mail',contractorWorker.getContractorWorkerByMail);
router.get('/getAllContractorWorkers',contractorWorker.getAllContractorWorkers);
router.patch('/updateContractorWorkerById/:id',contractorWorker.updateContractorWorkerById);
router.patch('/updateContractorWorkerMail/:mail',contractorWorker.updateContractorWorkerByMail);
router.delete('/deleteContractorWorkerById/:id',contractorWorker.deleteContractorWorkerById);
router.get('/loginUser/:mail',contractorWorker.loginUser);

router.get('/contractorProfile/:mail',contractorWorker.editProfileDisplay);
router.post('/contractorProfile/:mail',contractorWorker.editProfile);

router.post('/updateContractorPass/:mail',contractorWorker.updateContractorPass);
//router.patch('/updateContractorPass/:mail',contractorWorker.updateContractorPass);


router.get('/contractorUnavailability/:mail',contractorWorker.unDisplay);
router.post('/addUn/:mail',contractorWorker.addUn);

router.get('/contractorHomepage/:mail',contractorWorker.homepageDisplay);

router.get('/login/:mail',contractorWorker.loginUser);

//router.get('/findContractorInSpecDate',contractorWorker.findContractorInSpecDate);




module.exports=router


const router=require('express').Router()

const contractorWorker=require('../controllers/contractorWorkerController')


router.get('/contractorHomepage',(req,res)=>{
    res.render('contractorHomepage')        
});
router.get('/contractorProfile',(req,res)=>{
    res.render('contractorProfile')        
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

router.patch('/addUn/:id',contractorWorker.addUn)




module.exports=router


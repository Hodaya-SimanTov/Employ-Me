const router = require('express').Router();
const employer = require('../controllers/employerController');

router.post('/addEmployer', employer.addEmployer)
router.get('/signUp', (req, res) => {
    res.render('../views/employerSignUp1')
});
router.get('/homePage/:email', (req, res) => {
    res.render('../views/employerHomePage1', {email:req.params.email})
});

router.get('/resetPassword/:email', employer.resetPasswordDisplay);
router.post('/resetPassword/:email', employer.resetPassword);
router.get('/editProfile/:email', employer.editProfileDisplay);
router.post('/editProfile/:email', employer.editProfile);
router.get('/bookContractor/:emailEmployer/:idConstractor/:date', employer.bookContractorDisplay);
router.post('/bookContractor/:emailEmployer/:idConstractor/:date', employer.bookContractor);
router.get('/search/:email',(req, res) => {
    res.render('../views/employerSearch', {email: req.params.email});
});


router.post('/searchContractorByFields/:email', employer.searchContractorByFields);
router.get('/employerExists',(req, res) => {
    res.render('../views/employerExists'); 
})
router.get('/terminationOfEmployment/:id',employer.terminationOfEmploymentDisplay);
router.post('/terminationOfEmployment/:id', employer.confirmEmployments);
router.get('/confirmEmployments/:email', employer.confirmEmploymentsDisplay);
router.get('/employerHistory/:email', employer.historyEmployments);
router.get('/futureEmployement/:email', employer.futureEmployement);
router.get('/info/:email', employer.infoEmployment);
module.exports = router;



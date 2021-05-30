const router = require('express').Router();
const employer = require('../controllers/employerController');

router.post('/addEmployer', employer.addEmployer)

// router.get('/getEmployerByEmail/:email',employer.getEmployerByEmail);

router.get('/signUp', (req, res) => {
    res.render('../views/employerSignUp1')
});
router.get('/homePage/:email', (req, res) => {
    res.render('../views/employerHomePage', {email:req.params.email})
});

router.get('/resetPassword/:email', employer.resetPasswordDisplay);
router.post('/resetPassword/:email', employer.resetPassword);
router.get('/editProfile/:email', employer.editProfileDisplay);
router.post('/editProfile/:email', employer.editProfile);
//router.post('/addEmployement',employer.addEmployemnt);
router.get('/bookContractor/:emailEmployer/:idConstractor/:date', employer.bookContractorDisplay);
router.post('/bookContractor/:emailEmployer/:idConstractor/:date', employer.bookContractor);
router.get('/search/:email',(req, res) => {
    res.render('../views/employerSearch', {email: req.params.email});
});

//וספת כנרת מידע וסטטיסטיקות
router.get('/info/:email', employer.infoEmployment);


//הוספות של כנרת לסינון
//router.get('/ContractorAvialableDate',employer.ContractorUnavialableDate);
router.post('/searchContractorByFields/:email', employer.searchContractorByFields);
//עד כאן
// router.get('/searchResult',(req,res)=>{
//     res.render('../views/employerSearchResults')
// });
// router.get('/confirmEmployments/:email',(req,res)=>{
//     res.render('../views/employerConfirmEmployments',{email: req.params.email})
// });
router.get('/employerExists',(req, res) => {
    res.render('../views/employerExists'); 
})
router.get('/terminationOfEmployment/:id',employer.terminationOfEmploymentDisplay);
router.post('/terminationOfEmployment/:id', employer.confirmEmployments);
router.get('/confirmEmployments/:email', employer.confirmEmploymentsDisplay);
router.get('/employerHistory/:email', employer.historyEmployments);
router.get('/futureEmployement/:email', employer.futureEmployement);
//  router.get('/employerRate',(req,res)=>{
//     res.render('../views/employerRate')
// });

// router.post('/employerRate/:emailEmployer/:idConstractor/:date',employer.bookContractor);
//תוספות של כנרת למועדפים
router.get('/addFavorites/:email/:id', employer.addFavoriteConToArray);

module.exports = router;



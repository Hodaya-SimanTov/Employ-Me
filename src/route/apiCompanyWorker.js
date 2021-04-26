const router=require('express').Router()

const companyWorker=require('../controllers/companyWorkerController')

router.post('/addCompanyWorker',companyWorker.addCompanyWorker);

module.exports=router

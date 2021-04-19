const router=require('express').Router()

const employer=require('../controllers/employerController')

router.post('/addEmployer',(employer.addEmployer))



module.exports=router
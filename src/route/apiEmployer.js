const router=require('express').Router()

const employer=require('../controllers/employerController')


//employer
router.post('/addEmployer',(employer.addEmployer))

module.exports=router


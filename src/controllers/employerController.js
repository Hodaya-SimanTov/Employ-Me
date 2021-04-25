const Employer=require('../model/employer')

const addEmployer=(req,res)=>{
    const newEmployer=new Employer(req.body)
    newEmployer.save().then(employer =>{
        res.json({newEmployer:employer})

    }).catch(err=>{
        console.log(err);
    })

}





module.exports={addEmployer}
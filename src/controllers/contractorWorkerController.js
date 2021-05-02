const ContractorWorker=require('../model/contractorWorker')
const nodemailer=require('nodemailer')


function sendmail(email, name) {
    console.log(email)
    console.log(name)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ravitlevi999@gmail.com',
            pass: 'ravit99clark'
        }
    });

    var mailOptions = {
        from: 'ravitlevi999@gmail.com',
        to: email,
        subject: 'wellcom',
        text: `Hello ${name},\nThank you for joining our site, we will do everything to find you a suitable job!!`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(`error :: ${error}`);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}




const addContractorWorker=(req,res)=>{
    console.log(req.body);
    const newContractorWorker=new ContractorWorker(req.body)
    newContractorWorker.save().then(contractorWorker =>{
        //sendmail(contractorWorker.mail,contractorWorker.firstName)//שולח מייל בהרשמה
        //res.send("success to add")
        //res.json({contractorWorker:contractorWorker})
        console.log("add conrtactor");
        res.redirect('/contractorWorker/contractorHomepage');
        
    }).catch(err=>{
        console.log(`can not add this worker! ${err}`);
    })   

}

const getContractorWorkerById=(req,res)=>{
    ContractorWorker.findById(req.params.id).then(contractorWorker=>{
        res.cookie("mail",contractorWorker.mail)//שומר כשנכנסים שוב
        res.cookie("password",contractorWorker.password)
        res.json({contractorWorker:contractorWorker})
    }).catch(err=>{
        console.log(`can not get this worker! ${err}`);
    })
}

const getContractorWorkerByMail=(req,res)=>{
    ContractorWorker.find({mail:req.params.mail}).then(contractorWorker=>{
        // res.cookie("mail",contractorWorker.mail)//שומר כשנכנסים שוב
        // res.cookie("password",contractorWorker.password)
        res.json({contractorWorker:contractorWorker})
    }).catch(err=>{
        console.log(`can not get this worker! ${err}`);
    })
}

const getAllContractorWorkers=(req,res)=>{
    ContractorWorker.find().then(data=>{
        res.json({myContractorWorkers:data})
    }).catch(err=>{
        console.log(`can not get the workers! ${err}`);
    })    
}

const updateContractorWorkerById=(req,res)=>{//עוד לא עובדת
    ContractorWorker.findByIdAndUpdate(req.params.id,{firstName:req.body.firstName},{new:true})
    .then(contractorWorker=>{
        res.json({contractorWorker:contractorWorker})
    }).catch(err=>{
        console.log(`can not update this worker! ${err}`);
    })
    
}

const updateContractorWorkerByMail=(req,res)=>{//עוד לא עובדת
    ContractorWorker.findOneAndUpdate({mail:req.params.mail},{phone:req.body.phone},{new:true}).then(contractorWorker=>{
        res.json({contractorWorker:contractorWorker})
    }).catch(err=>{
        console.log(`can not update this worker! ${err}`);
    })
    
}

const deleteContractorWorkerById=(req,res)=>{
    ContractorWorker.findByIdAndDelete(req.params.id).then(contractorWorker=>{
        res.send("success to dalete")
    }).catch(err=>{
        console.log(`can not delete this worker! ${err}`);
    })
    
}

//לא להתייחס לזה זה קשור לעדכון
// occupationArea:req.body.occupationArea,
//         experienceField:req.body.experienceField,serviceArea:req.body.serviceArea,
//         scopeWork:req.body.scopeWork}


module.exports={addContractorWorker,getContractorWorkerById,updateContractorWorkerById,deleteContractorWorkerById
    ,getAllContractorWorkers,getContractorWorkerByMail,updateContractorWorkerByMail}
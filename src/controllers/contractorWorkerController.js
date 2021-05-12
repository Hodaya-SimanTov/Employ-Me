//const ContractorWorker=require('../model/contractorWorker')
const Unavailability=require('../model/unavailabilityContractor')
const {ContractorWorker,validate1,validateEditContractor } = require('../model/contractorWorker');
const { Employer, validate2,validateEditEmployer } = require('../model/employer');
const { CompanyWorker, validate3,validateEditCompanyWorker } = require('../model/companyWorker');
const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken')
var mongo=require('mongodb');
var assert=require('assert');
//const bcrypt = require('bcrypt');

//חישוב שכר לפי גיל
const salaryOfHour =function (contractor_id,birthday) {
    let bd = new Date('2000, 01, 01')// the month is 0-indexed
    const b=new Date(birthday);
    var x;
    if(b>=bd)
        x=25;
    else
        x=30;
    ContractorWorker.findByIdAndUpdate(contractor_id, {hourlyWage:x})
        .then(()=>{
            console.log('add salary');
        }).catch(err=>{
        console.log(err);
    })
}

//שליחת מייל
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


//הוספת עובד חדש
const addContractorWorker=(req,res)=>{
    if(contractorExists(req.body.mail)==false){
        console.log(req.body);
        const newContractorWorker=new ContractorWorker(req.body)
        newContractorWorker.save().then(contractorWorker =>{
            //sendmail(contractorWorker.mail,contractorWorker.firstName)//שולח מייל בהרשמה
            console.log('add conrtactor');
            addUnavailabilityArray(contractorWorker._id)//הוספת מערך חופשות ריק
            salaryOfHour(contractorWorker._id,contractorWorker.birthday);//עדכון השכר לשעה
            res.redirect('/contractorWorker/contractorHomepage');
        }).catch(err=>{
            console.log(`can not add this worker! ${err}`);
        }) 
    }  
    else{
        console.log("exists!!");
        res.redirect(`/contractorWorker/contractorExists`); 
    }
}

const contractorExists=(mail)=>{
    ContractorWorker.findOne({ mail:mail }).then(contractor=>{
        console.log("exists");
        return true;
    }).catch(err=>{
        console.log("not exists!!");
        return false;
    })
}

// const loginUser=(req,res)=>{
//     ContractorWorker.findById(req.params.mail).then(contractorWorker=>{
//         console.log("in login");
//         const token=jwt.sign({mail: contractorWorker.mail, password: contractorWorker.password}, process.env.SECRET);
//         res.send(token);
//     }).catch(err=>{
//         console.log(err);
//     })


// }

const addUnavailabilityArray=(contractor_id)=>{    
    const newUnavailability=new Unavailability({contractorId:contractor_id})
    newUnavailability.save().then(unavailability =>{
        console.log("add new unavailability object");
        ContractorWorker.findByIdAndUpdate(contractor_id, {unavailability:unavailability._id})
            .then(()=>{
                console.log("add unavailability array to contractor");
            }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(`can not add this unavailability! ${err}`);
    })
}

//מקבלת תאריך בודד ומוסיפה אותו למערך שבאובייקט אי זמינות
const addDateToArray=(idArray,year,month,day)=>{
    const d=new Date(year,month,day);
    Unavailability.findByIdAndUpdate(idArray, {$push:{'unavailabArray':d}})
        .then(()=>{
            console.log("add date to array contractor");
        }).catch(err=>{
        console.log(err);
    })
}

const unDisplay=async (req, res) => {
    let contractor = await ContractorWorker.findOne({mail:req.params.mail})
    if (contractor) {
        res.render('../views/contractorUnavailability',{mail:req.params.mail});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const addUn=(req,res)=>{
    ContractorWorker.findOne({mail:req.params.mail}).then(contractor=>{
        addDateToUnavailabilityarray(contractor.unavailability,req.body.start,req.body.end);
        console.log(req.body.start+"  "+req.body.end);
        res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
    }).catch(err=>{
        console.log(err);
    })
}


//מקבל תאריך התחלה וסוף ומוסיף את כל הימים האלו למערך החופשות של העובד
const addDateToUnavailabilityarray=(idArray,startDate,endDate)=>{// בהנחה שהתאריכים עוקבים
    var m=[31,29,31,30,31,30,31,31,30,31,30,31];
    var i;
    var s=new Date(startDate);
    var e=new Date(endDate);
    var start=s.getDate();//מחזיר את היום 1-31
    var end=e.getDate();
    if(s.getMonth()!=e.getMonth()){

        for(i=start+1;i<=m[s.getMonth()];i++){
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
        }
        for(i=1;i<=end+1;i++){
            addDateToArray(idArray,s.getFullYear(),e.getMonth(),i);
        }
    }
    else{
        for(i=start+1;i<=end+1;i++){
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
        }
    }
}



//מחזיר מערך אידי של עובדים שתפוסם בתאריכים אלו
const findContractorInSpecDate=(req,res)=>{
    var array=[];
    var i=0;
    Unavailability.find( {unavailabArray : { $nin: [req.body.date] }}).then(unavailability=>{
        res.send({contractors:unavailability});
        console.log(unavailability);
        for(i=0;i<unavailability.length;i++){
            array[i]=unavailability[i].contractorId;
        }
        console.log(array);
        return array;
    }).catch(err=>{
        console.log(err);
    })
}



// const loginUser=(req,res)=>{
//     ContractorWorker.findById(req.params.mail).then(contractorWorker=>{
//         console.log("in login");
//         const token=jwt.sign({mail: contractorWorker.mail, password: contractorWorker.password}, process.env.SECRET);
//         res.send(token);
//     }).catch(err=>{
//         console.log(err);
//     })


// }

const loginUser=(req,res)=>{
    console.log("select: "+req.body.select);
    if(req.body.select=="Employer"){
        Employer.findOne({ email: req.body.mail }).then(employer=>{
            const validPassword =  bcrypt.compare(req.body.password, employer.password);
            if (!validPassword) {
                res.redirect(`/contractorWorker/notLogin`);
            }
            else{
                res.redirect(`/employer/homePage/${req.body.mail}`);  
            }           
        }).catch(err=>{
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        }) 
    }
    if(req.body.select=="Company Worker"){
        CompanyWorker.findOne({mail: req.body.mail}).then(company => {
            console.log("in login company");
            if (company.password == req.body.password) {
                if (company.firstLogin == 0) {
                    CompanyWorker.findOneAndUpdate({mail: req.body.mail}, {firstLogin: 1}).then(company => {
                        res.redirect(`/companyWorker/editProfile/${req.body.mail}`);
                    }).catch(err => {
                        console.log(err);
                        res.redirect(`/contractorWorker/notLogin`);
                    })
                }
            }else{
                    res.redirect(`/contractorWorker/notLogin`);
                }    
        }).catch(err => {
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        })
    }
    if(req.body.select=="Contractor Worker"){        
      ContractorWorker.findOne({ mail: req.body.mail }).then(contractor=>{
        console.log("in login contractor");
        if(contractor.password==req.body.password){
            res.redirect(`/contractorWorker/contractorHomepage/${req.body.mail}`);
        }
        else{
            res.redirect(`/contractorWorker/notLogin`);
        }
        }).catch(err=>{
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        })  
    }    
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


const deleteContractorWorkerById=(req,res)=>{
    ContractorWorker.findByIdAndDelete(req.params.id).then(contractorWorker=>{
        res.send("success to dalete")
    }).catch(err=>{
        console.log(`can not delete this worker! ${err}`);
    })

}


const getContractorByEmail=async(email)=>{

    let contractor = await ContractorWorker.findOne({mail:req.params.mail})
    if (contractor) {
        res.render('../views/contractorProfile',{contractor})
    }
    else {
        return res.status(400).send('That mail is error!');
    }

}
const editProfileDisplay=async (req, res) => {

    let contractor = await ContractorWorker.findOne({mail:req.params.mail})
    const d=`${contractor.birthday.getFullYear()}`+'-'+`${contractor.birthday.getMonth()+1}`+`-`+`${contractor.birthday.getUTCDate()}`
    if (contractor) {
        res.render('../views/contractorProfile',{contractor:contractor,date:d});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
const editProfile=async (req, res) => {
    // const { error } = validateEditContractor(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    let contractor= await ContractorWorker.findOneAndUpdate({mail: req.params.mail}, req.body, {new: true });
    res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
}



const updateContractorPass=(req,res)=>{
    console.log(`in update pass`);
    ContractorWorker.findOneAndUpdate({mail: req.params.mail}, {password: req.body.password})
        .then(contractorWorker=>{
            console.log(req.body.password);
            res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
        }).catch(err=>{
        console.log(`can not update this paa! ${err}`);
    })

}

const homepageDisplay=async (req, res) => {
    let contractor = await ContractorWorker.findOne({mail:req.params.mail})
    if (contractor) {
        res.render('../views/contractorhomepage',{mail:req.params.mail});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const contractorFuture=(req,res)=>{
    // const today=new Date()
    // const d=new Date(today.getFullYear(),today.getMonth(),today.getUTCDate()+1)
    Employement.find({constructorEmail: req.params.mail , status:'open' })
        .then(currentEmployement=>{
            currentEmployement.sort((a, b) => b.date - a.date)
            res.render('../views/contractorFuture',{result:currentEmployement});
        }).catch(err=>{
        console.log(`can not find this employement! ${err}`);
    })
}

const contractorHistory=(req,res)=>{
    const today=new Date()
    const d=new Date(today.getFullYear(),today.getMonth(),today.getUTCDate())
    Employement.find( { $or:[{constructorEmail: req.params.mail , status:'close'},{constructorEmail: req.params.mail , status:'verified‏'}]})
        .then(currentEmployement=>{
            currentEmployement.sort((a, b) => b.date - a.date)
            res.render('../views/contractorHistory',{result:currentEmployement});
        }).catch(err=>{
        console.log(`can not find this employement! ${err}`);
    })
}

const endEmployement=(req,res)=>{
    Employement.findByIdAndUpdate(req.params.id,{status:"verified‏"})
        .then(employement=>{
            //res.render('../views/contractorFuture',{result:employement});
            res.redirect(`/contractorWorker/contractorHistory/${employement.constructorEmail}`);
        }).catch(err=>{
        console.log(`can not find this employement! ${err}`);
    })
}


module.exports={addContractorWorker,getContractorWorkerById,deleteContractorWorkerById
    ,getAllContractorWorkers,getContractorWorkerByMail,loginUser,addDateToUnavailabilityarray
    ,addUn , getContractorByEmail ,editProfileDisplay ,editProfile,updateContractorPass,unDisplay,homepageDisplay, findContractorInSpecDate
    ,contractorFuture,contractorHistory,endEmployement,};
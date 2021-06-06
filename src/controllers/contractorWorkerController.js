//const ContractorWorker=require('../model/contractorWorker');
const Unavailability = require('../model/unavailabilityContractor');
const ContractorMessage = require('../model/contractorMessage');
const {ContractorWorker,validate1,validateEditContractor } = require('../model/contractorWorker');
const {ContractorPaycheck } = require('../model/contractorPaycheck');
const { Employer, validate2,validateEditEmployer } = require('../model/employer');
const { CompanyWorker, validate3,validateEditCompanyWorker } = require('../model/companyWorker');
const {Employement,validateEmployement}=require('../model/employement');
const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var mongo = require('mongodb');
var assert = require('assert');
const bcrypt = require('bcrypt');
var cron = require('node-cron');
var shell = require('shelljs');
const MailMessage = require('nodemailer/lib/mailer/mail-message');
const { func } = require('joi');

//חישוב שכר לפי גיל
const salaryOfHour = function (contractor_id,birthday) {
    let bd = new Date('2000, 01, 01')// the month is 0-indexed
    const b=new Date(birthday);
    var x;
    if(b >= bd)
        x=25;
    else
        x=30;
    ContractorWorker.findByIdAndUpdate(contractor_id, {hourlyWage:x})
        .then(contractor => {
            var date = new Date();
            console.log('add salary');
            addPaycheck(contractor.mail,date.getMonth()+1,date.getFullYear(),0,0,0);
        }).catch(err=>{
        console.log(err);
    });
}

//שליחת מייל
function sendmail(email, name) {
    console.log(email);
    console.log(name);
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
const addContractorWorker = (req,res)=> {
    var date=new Date();
    ContractorWorker.findOne({mail:req.body.mail}).then(con=> {
        if(con) {
            console.log('exists!!');
            res.redirect(`/contractorWorker/contractorExists`); 
        }
        else {
           const newContractorWorker=new ContractorWorker(req.body);
            newContractorWorker.save().then(contractorWorker => {
                var date=new Date();
            //sendmail(contractorWorker.mail,contractorWorker.firstName)//שולח מייל בהרשמה
                console.log('add conrtactor');
                addUnavailabilityArray(contractorWorker._id);//הוספת מערך חופשות ריק
                salaryOfHour(contractorWorker._id,contractorWorker.birthday)//עדכון השכר לשעה
                addMessage(contractorWorker.mail,date,"NewEmployee","Welcome!!\nThank you for joining our site, we will do everything to find you a suitable job !! ");
                res.redirect(`/companyWorker/homePage/${req.body.mail}`);
        }).catch(err=> {
            console.log(`can not add this worker! ${err}`);
        });  
        }       
   
    }).catch(err=> {
        console.log(err);
    });
    
}

const contractorExists = (mail) => {
    ContractorWorker.findOne({ mail:mail }).then(contractor=>{
        console.log('exists');
        return true;
    }).catch(err => {
        console.log('not exists!!');
        return false;
    })
}


const addUnavailabilityArray = (contractor_id)=> {    
    const newUnavailability=new Unavailability({contractorId:contractor_id});
    newUnavailability.save().then(unavailability => {
        console.log('add new unavailability object');
        ContractorWorker.findByIdAndUpdate(contractor_id, {unavailability:unavailability._id})
            .then(() => {
                console.log("add unavailability array to contractor");
            }).catch(err=> {
            console.log(err);
        });
    }).catch(err=> {
        console.log(`can not add this unavailability! ${err}`);
    });
}

//מקבלת תאריך בודד ומוסיפה אותו למערך שבאובייקט אי זמינות
const addDateToArray = (idArray,year,month,day)=> {
    const d = new Date(year,month,day);
    Unavailability.findByIdAndUpdate(idArray, {$push:{'unavailabArray':d}})
        .then(() => {
            console.log("add date to array contractor");
        }).catch(err => {
        console.log(err);
    })
}

const unDisplay = async (req, res) => {
    let contractor = await ContractorWorker.findOne({mail:req.params.mail});
    if (contractor) {
        res.render('../views/contractorUnavailability',{mail:req.params.mail});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const addUn = (req,res) => {
    ContractorWorker.findOne({mail:req.params.mail}).then(contractor=>{
        addDateToUnavailabilityarray(contractor.unavailability,req.body.start,req.body.end);
        console.log(req.body.start+"  "+req.body.end);
        res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
    }).catch(err => {
        console.log(err);
    });

}


//מקבל תאריך התחלה וסוף ומוסיף את כל הימים האלו למערך החופשות של העובד
const addDateToUnavailabilityarray = (idArray,startDate,endDate)=> {// בהנחה שהתאריכים עוקבים
    var m = [31,29,31,30,31,30,31,31,30,31,30,31];
    var i;
    var s = new Date(startDate);
    var e = new Date(endDate);
    var start = s.getDate();//מחזיר את היום 1-31
    var end = e.getDate();
    if(s.getMonth() != e.getMonth()) {

        for( i = start+1 ; i <= m[s.getMonth()] ; i++) {
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
        }
        for(i = 1 ; i <= end+1 ; i++) {
            addDateToArray(idArray,s.getFullYear(),e.getMonth(),i);
        }
    }
    else {
        for(i = start+1 ; i <= end+1 ; i++) {
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
        }
    }
}



//מחזיר מערך אידי של עובדים שתפוסם בתאריכים אלו
const findContractorInSpecDate = (req,res) => {
    var array = [];
    var i = 0;
    Unavailability.find( {unavailabArray : { $nin: [req.body.date] }}).then(unavailability=> {
        res.send({contractors:unavailability});
        console.log(unavailability);
        for(i = 0 ; i < unavailability.length ; i++) {
            array[i] = unavailability[i].contractorId;
        }
        console.log(array);
        return array;
    }).catch(err => {
        console.log(err);
    })
}




const loginUser = (req,res) => {
    console.log('select: ' + req.body.select);
    if(req.body.select == 'Employer') {
        Employer.findOne({ email: req.body.mail }).then(employer=> {
            const validPassword =  bcrypt.compare(req.body.password, employer.password).then(validPassword=> {
                if (!validPassword) {
                    res.redirect(`/contractorWorker/notLogin`);
                }
                else {
                    res.redirect(`/employer/homePage/${req.body.mail}`);  
                }    
            }).catch(err => {
                
            })
                   
        }).catch(err => {
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        });
    }
    if(req.body.select == 'Company Worker') {
        CompanyWorker.findOne({mail: req.body.mail}).then(company => {
            console.log('in login company');
            if (company.password == req.body.password) {
                if (company.firstLogin == 0) {
                    CompanyWorker.findOneAndUpdate({mail: req.body.mail}, {firstLogin: 1}).then(company => {
                        res.redirect(`/companyWorker/editProfile/${req.body.mail}`);
                    }).catch(err => {
                        console.log(err);
                        res.redirect(`/contractorWorker/notLogin`);
                    });
                }
                else {
                    res.redirect(`/companyWorker/homePage/${req.body.mail}`);
                }
            }else {
                    res.redirect(`/contractorWorker/notLogin`);
                }    
        }).catch(err => {
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        });
    }
    if(req.body.select == 'Contractor Worker') {        
      ContractorWorker.findOne({ mail: req.body.mail }).then(contractor => {
        console.log('in login contractor');
        if(contractor.password == req.body.password) {
            res.redirect(`/contractorWorker/contractorHomepage/${req.body.mail}`);
        }
        else {
            res.redirect(`/contractorWorker/notLogin`);
        }
        }).catch(err => {
            console.log(err);
            res.redirect(`/contractorWorker/notLogin`);
        });
    }    
}



const getContractorWorkerById = (req,res) => {
    ContractorWorker.findById(req.params.id).then(contractorWorker => {
        res.cookie("mail",contractorWorker.mail);//שומר כשנכנסים שוב
        res.cookie("password",contractorWorker.password);
        res.json({contractorWorker:contractorWorker});
    }).catch(err => {
        console.log(`can not get this worker! ${err}`);
    });
}

const getContractorWorkerByMail = (req,res) => {
    ContractorWorker.find({mail:req.params.mail}).then(contractorWorker => {
        // res.cookie("mail",contractorWorker.mail)//שומר כשנכנסים שוב
        // res.cookie("password",contractorWorker.password)
        res.json({contractorWorker:contractorWorker});
    }).catch(err => {
        console.log(`can not get this worker! ${err}`);
    });
}

const getAllContractorWorkers = (req,res) => {
    ContractorWorker.find().then(data => {
        res.json({myContractorWorkers:data});
    }).catch(err => {
        console.log(`can not get the workers! ${err}`);
    });
}


const deleteContractorWorkerById = (req,res) => {
    ContractorWorker.findByIdAndDelete(req.params.id).then(contractorWorker => {
        res.send('success to dalete');
    }).catch(err => {
        console.log(`can not delete this worker! ${err}`);
    });
}


const getContractorByEmail = async(email) => {

    let contractor = await ContractorWorker.findOne({mail:req.params.mail});
    if (contractor) {
        res.render('../views/contractorProfile',{contractor})
    }
    else {
        return res.status(400).send('That mail is error!');
    }

}
const editProfileDisplay = async (req, res) => {

    let contractor = await ContractorWorker.findOne({mail:req.params.mail});
    const d = `${contractor.birthday.getFullYear()}` + '-' + `${contractor.birthday.getMonth()+1}` + `-` + `${contractor.birthday.getUTCDate()}`
    if (contractor) {
        res.render('../views/contractorProfile',{contractor:contractor,date:d});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}
const editProfile = async (req, res) => {
    // const { error } = validateEditContractor(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    let contractor = await ContractorWorker.findOneAndUpdate({mail: req.params.mail}, req.body, {new: true });
    res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
}



const updateContractorPass = (req,res) => {
    console.log(`in update pass`);
    ContractorWorker.findOneAndUpdate({mail: req.params.mail}, {password: req.body.password})
        .then(contractorWorker => {
            console.log(req.body.password);
            res.redirect(`/contractorWorker/contractorHomepage/${req.params.mail}`);
        }).catch(err => {
        console.log(`can not update this paa! ${err}`);
    });

}

const homepageDisplay = async (req, res) => {
    var i;
    var today = new Date();
    let contractor = await ContractorWorker.findOne({mail:req.params.mail});
    if (contractor) {
        var name = contractor.firstName+" "+contractor.lastName
        Employement.find({ constructorEmail: req.params.mail , status:'approved'})
        .then(emp => {
            // console.log(emp);
            // for(i=0;i<emp.length;i++){
            //     if(emp[i].date.getDate()  == today.date.getDate() && emp[i].date.getMonth() == today.date.getMonth() && emp[i].date.getFullYear() == today.date.getFullYear()){
            //         console.log(currentEmployement[i]);
            //         res.render('../views/contractorhomepage',{mail:req.params.mail,today:currentEmployement[i]});
            //     }
            // }
            // // res.render('../views/contractorhomepage',{mail:req.params.mail,today:currentEmployement[1]});
            res.render('../views/contractorhomepage',{mail:req.params.mail,result:emp,name:name});        
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
        });        
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const contractorFuture = (req,res) => {
    // const today=new Date()
    // const d=new Date(today.getFullYear(),today.getMonth(),today.getUTCDate()+1)
    Employement.find({ constructorEmail: req.params.mail , status:'approved'})
        .then(currentEmployement => {
            currentEmployement.sort((a, b) => a.date - b.date);
            res.render('../views/contractorFuture',{result:currentEmployement});
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}

const contractorHistory = (req,res) => {
    const today = new Date();
    const d = new Date(today.getFullYear(),today.getMonth(),today.getUTCDate());
    Employement.find( { $or:[{constructorEmail: req.params.mail , status:'closed'},{constructorEmail: req.params.mail , status:'verified‏'}]})
        .then(currentEmployement => {
            currentEmployement.sort((a, b) => b.date - a.date)
            res.render('../views/contractorHistory',{result:currentEmployement});
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}

const contractorWaitApproval = (req,res) => {
    Employement.find( {constructorEmail: req.params.mail , status:'waiting for approval'})
        .then(currentEmployement => {
            currentEmployement.sort((a, b) => b.date - a.date)
            res.render('../views/contractorWaitShift',{result:currentEmployement});
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}

const approveShift = (req,res) => {
    Employement.findByIdAndUpdate(req.params.id,{status:'approved'})
        .then(employement => {
            res.redirect(`/contractorWorker/contractorFuture/${employement.constructorEmail}`);
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}
const cancelShift = (req,res) => {
    var i;
    Employement.findByIdAndUpdate(req.params.id,{status:`canceled`})
        .then(employement => {
            ContractorWorker.findOne({mail:employement.constructorEmail}).then(contractor=>{
               Unavailability.findById(contractor.unavailability)
               .then(unavailability=> {    
                   var arr=unavailability.unavailabArray               
                    for( i = 0 ; i < unavailability.unavailabArray.length ; i++) {
                        if(arr[i].getDate()-1 == employement.date.getDate() && arr[i].getMonth() == employement.date.getMonth() && arr[i].getFullYear() == employement.date.getFullYear()){
                            Unavailability.findByIdAndUpdate(unavailability._id,{$pull:{'unavailabArray':arr[i]}})
                            .then(unavailability2=> {  
                                console.log("delete date");                                                              
                            }).catch(err => {
                                console.log(err);
                            })
                            break;
                        }
                    }
                    res.redirect(`/contractorWorker/contractorWaitApproval/${employement.constructorEmail}`);
                }).catch(err => {
                    console.log(err);
                })     
            }).catch(err => {
                console.log(err);
            })     
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}


const endEmployement = (req,res) => {
    var time = new Date();
    var now = time.getHours() + ":" + time.getMinutes()+":" + time.getSeconds();
    Employement.findByIdAndUpdate(req.params.id,{status:`verified‏`,endTime:now})
        .then(employement => {
            //res.render('../views/contractorFuture',{result:employement});
            res.redirect(`/contractorWorker/contractorHistory/${employement.constructorEmail}`);
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}

const startEmployement = (req,res) => {
    var time = new Date();
    var now = time.getHours() + ":" + time.getMinutes()+":" + time.getSeconds();
    Employement.findByIdAndUpdate(req.params.id,{start:"yes",startTime:now})
        .then(employement => {
            //res.render('../views/contractorFuture',{result:employement});
            res.redirect(`/contractorWorker/contractorFuture/${employement.constructorEmail}`);
        }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}

const payChecksList = async (req,res) => {
    let payChecks = await ContractorPaycheck.find({contractorMail:req.params.mail});
    if (payChecks) {
        payChecks.sort((a, b) => b.month - a.month)
        res.render('../views/contractorPaycheckList',{result:payChecks});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const payCheck = async (req,res) => {
    let payCheck = await ContractorPaycheck.findOne({contractorMail:req.params.mail,month:req.params.month});
    if (payCheck) {
        res.render('../views/contractorPayChecks',{payCheck});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}




const addPaycheck =  (mail,month,year,hours,shifts,vacation) => {
    var m = month-1;    
    ContractorWorker.findOne({mail:mail}).then(con => {
        var fullName = con.firstName + " " + con.lastName;
        ContractorPaycheck.findOne({contractorMail:mail,month:m}).then(pay => {
            if(!pay){
                const newPaycheck=new ContractorPaycheck({month:month,year:year,contractorMail:mail,totalHours:hours,totalShifts:shifts,totalVacation:vacation,totalSalary:0,contractorName:fullName,hourlyWage:con.hourlyWage,tHours:hours,tShifts:shifts,tVacation:vacation});
                newPaycheck.save().then(paycheck => {
                }).catch(err=> {
                    console.log(`can not add this paycheck! ${err}`);
                });
            }
            else if(pay){
                var h = pay.totalHours + hours;
                var s = pay.totalShifts + shifts;
                var v = pay.totalVacation + vacation;
                const newPaycheck=new ContractorPaycheck({month:month,year:year,contractorMail:mail,totalHours:hours,totalShifts:shifts,totalVacation:vacation,totalSalary:0,contractorName:fullName,hourlyWage:con.hourlyWage,tHours:h,tShifts:s,tVacation:v});
                newPaycheck.save().then(paycheck => {
                }).catch(err => {
                    console.log(`can not add this paycheck! ${err}`);
                });
            }   
        }).catch(err=> {
            console.log(`can not find this pay! ${err}`);
        });          
    }).catch(err=> {
        console.log(`can not find this contractor! ${err}`);
    });     
}      

const totalHours=(mail,month,year)=>{
    var i,totalHours=0;
    Employement.find({constructorEmail:mail}).then(employements => {
        for(i=0;i<employements.length;i++){
            if(employements[i].date.getMonth()+1 == month && employements[i].date.getFullYear() == year && employements[i].status == 'close'){
                totalHours+=employements[i].jobScope;
            }        
        }
        ContractorPaycheck.findOneAndUpdate({contractorMail:mail,month:month,year:year},{totalHours:totalHours}).then(pay=>{
        }).catch(err=>{console.log(err);})
    }).catch(err => {
        console.log(`can not find this employement! ${err}`);
    });
}


const totalShifts=(mail,month,year)=>{
    let i,totalShifts=0;
    Employement.find({constructorEmail:mail}).then(employements => {
        for(i=0;i<employements.length;i++){
            if(employements[i].date.getMonth()+1 == month && employements[i].date.getFullYear() == year && employements[i].status == 'close'){
                totalShifts+=1;
            }    
        } 
        ContractorPaycheck.findOneAndUpdate({contractorMail:mail,month:month,year:year},{totalShifts:totalShifts}).then(pay=>{
        }).catch(err=>{console.log(err);})
    }).catch(err => {     
        console.log(`can not find this employement! ${err}`);        
    });
}

const totalVacation=(mail,month,year)=>{
    let i,j,totalVacation=0;
    ContractorWorker.findOne({mail:mail}).then(contractor =>{
       Unavailability.find({contractorId:contractor._id}).then(un => {
            for(i=0;i<un.length;i++){
                for(j=0;j<un[i].unavailabArray.length;j++){
                    if(un[i].unavailabArray[j].getMonth()+1 == month && un[i].unavailabArray[j].getFullYear() == year){
                        totalVacation+=1;
                    }    
                }

            } 
            ContractorPaycheck.findOneAndUpdate({contractorMail:mail,month:month,year:year},{totalVacation:totalVacation}).then(pay=>{
            }).catch(err=>{console.log(err);})
        }).catch(err => {
            console.log(`can not find this unavalability! ${err}`);
        });
    }).catch(err => {
        console.log(`can not find this contractor! ${err}`);
    });
}



const startPaycheck = () => {
    let i;
    var date=new Date();
    ContractorWorker.find().then(contractors => {
        for(i=0;i<contractors.length;i++){
            addPaycheck(contractors[i].mail,date.getMonth()+1,date.getFullYear(),0,0,0);
        }
    })
}

const updatePaycheckEnd =  () => {
    let i;
    var date=new Date();
    ContractorPaycheck.find().then(pays => {
        for(i=0;i<pays.length;i++){
            if(pays[i].month == date.getMonth()){//חודש אחרון
                totalHours(pays[i].contractorMail,pays[i].month,pays[i].year);
                totalShifts(pays[i].contractorMail,pays[i].month,pays[i].year);
                totalVacation(pays[i].contractorMail,pays[i].month,pays[i].year);
                let t=(pays[i].totalHours * pays[i].hourlyWage)-((pays[i].totalHours * pays[i].hourlyWage * 0.004) + (pays[i].totalHours * pays[i].hourlyWage * 0.031) + (pays[i].totalHours * pays[i].hourlyWage * 0.125))
                ContractorPaycheck.findByIdAndUpdate(pays[i]._id,{tHours:pays[i].tHours+pays[i].totalHours,tShifts:pays[i].tShifts+pays[i].totalShifts,tVacation:pays[i].tVacation+pays[i].totalVacation,totalSalary:t}).then(pay => {
                }).catch(err=>{
                    console.log(err);
                })
            }
            
        }
    }).catch(err=>{
        console.log(err);
    })
}

 const updatePaycheck = (mail,month,year) => {
    totalHours(mail,month,year);
    totalShifts(mail,month,year);
    totalVacation(mail,month,year);  
    let i;
    var date=new Date();
    ContractorPaycheck.findOne({contractorMail:mail,month:month,year:year}).then(pay => {
        let t=(pay.totalHours * pay.hourlyWage)-((pay.totalHours * pay.hourlyWage * 0.004) + (pay.totalHours * pay.hourlyWage * 0.031) + (pay.totalHours * pay.hourlyWage * 0.125))
        ContractorPaycheck.findByIdAndUpdate(pay._id,{tHours:pay.tHours+pay.totalHours,tShifts:pay.tShifts+pay.totalShifts,tVacation:pay.tVacation+pay.totalVacation,totalSalary:t}).then(pay => {
        }).catch(err=>{console.log(err);});
    }).catch(err=>{
        console.log(err);
    });   
}

const updatePaycheckEvery5Minutes = () => {
    var i;
    var date=new Date();
    ContractorWorker.find().then(contractors => {
        for(i=0;i<contractors.length;i++){
            updatePaycheck(contractors[i].mail,date.getMonth()+1,date.getFullYear());
        }
    }).catch(err => {
        console.log(err);
    })
}


// תזמון כל תחילת חודש ליצור תלוש ריק לכל העובדים ומעדכנת סופית שכר לתלוש הקודם
cron.schedule("0 0 1 * *", function() {
    console.log("cron running - start month - close the old paychecks and open new paychecks");
    updatePaycheckEnd();
    startPaycheck();        
});

//תזמון כל 5 דקות לעדכן את נתוני התלוש הנוכחי
cron.schedule("*/12 * * * *", function() {
    console.log("cron running - update all paychecks");
    updatePaycheckEvery5Minutes();
});
    



// cron.schedule("5 19 * * *", function() {
//     console.log("cron running");
//     startPaycheck();
// });



//מחיקת כל התלושים במונגו
// cron.schedule("57 16 * * *", function() {
//     var i;
//     console.log("cron running");
//     ContractorPaycheck.find().then(c=>{
//         for(i=0;i<c.length;i++){
//             ContractorPaycheck.findByIdAndDelete(c[i]._id).then(a=>{
//                 console.log("delete: "+i);
//             })
            
//         }
//     })
// });


//עדכון כל יום
cron.schedule("0 8 * * *", () => {
    console.log('cron.schedule1');
    updateSalary();
});

//עדכון השכר לפי גיל cron קורא לה
async function updateSalary(){
    console.log('updateSalary');
    var d = new Date();// the month is 0-indexed
    
    //var d2 = new Date('2000, 01, 01');// the month is 0-indexed
    //const b=new Date(item.birthday);
    d.setFullYear(d.getFullYear()-21);
    console.log(d);
    var q = {
    //mail: {$in: ['pp@gmail.com']}
    birthday: {$lt: d}
    }
    
    try {
        console.log('try');
        await ContractorWorker.updateMany(q, {$set: {hourlyWage: 30}}).then((result) => {
            console.log('cron.schedule2');
        }).catch(e => {
            console.log(e);
        })
    }catch (error) {
        // your catch block code goes here
    }
}
    
    
const addMessage= (mail,date,type,text) => {
    const newContractorMessage=new ContractorMessage({contractorMail:mail,date:date,type:type,text:text});
    newContractorMessage.save().then(message => {
    }).catch(err => {
        console.log(`can not add this message! ${err}`);
    });
}


const sendMessageDiplay = async (req,res) => {
    let contractors = await ContractorWorker.find();
    if (contractors) {
        res.render(`../views/companyMessage`,{result:contractors,mail:req.params.mail});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}


const sendMessage= (req,res) => {
    var date = new Date();
    var mail=str = req.body.contractor.split("- ").pop();
    const newContractorMessage=new ContractorMessage({contractorMail:mail,date:date,type:req.body.type,text:req.body.text});
    newContractorMessage.save().then(message => {
        res.redirect(`/companyWorker/homePage/${req.params.mail}`);
    }).catch(err => {
        console.log(`can not add this message! ${err}`);
    });
}


const messageList = async (req,res) => {
    let messages = await ContractorMessage.find({contractorMail:req.params.mail});
    if (messages) {
        messages.sort((a, b) => b.date - a.date)
        res.render('../views/contractorMessage',{result:messages});
    }
    else {
        return res.status(400).send('That email is error!');
    }
}

const jobRateDisplay = async (req,res) => {
    //חישוב ממוצע גלובלי
    let i,j,ratGlobal=0, rat = 0, sum = 0 ,month = 0;  
    var feedback = []; let f = 0; 
    const employements = await Employement.find({constructorEmail:req.params.mail, status:'close'});
    if(employements) {
        for(i=0;i<employements.length;i++){
            if(employements[i].rating != 0){
                rat+=1;
                sum+=employements[i].rating;
            }
            if(employements[i].feedback != ""){
                feedback[f] = employements[i];
                f++;
            }
        }
        if(rat != 0)
            ratGlobal = sum/rat;
    }
    else{err => { console.log(err); }}  
    

    var date = new Date();
    var arrMonth = [];
    //נמצא את כמות החודשים שהעובד בחברה
    const pays = await ContractorPaycheck.find({contractorMail:req.params.mail});
    if(pays) {
        month = pays.length;
        const employements = await Employement.find({constructorEmail:req.params.mail, status:'close'});
        for(j=0;j<month;j++){//לכל חודש נחשב ממוצע
            sum = 0; rat = 0;            
            if(employements) {
                for(i=0;i<employements.length;i++){
                    if((employements[i].rating != 0) && ((employements[i].date.getMonth()+1) == (date.getMonth()+1-j)) ){
                        rat+=1;
                        sum+=employements[i].rating;
                    }            
                }     
            }else{err => { console.log(err); }}
            if(rat != 0)
                {arrMonth[j] = sum/rat;}
            else    
                {arrMonth[j] = 0;}            
        }
    }
    else{err => { console.log(err); }}

    res.render('../views/contractorJobRate',{mail:req.params.mail,ratGlobal:ratGlobal,arrMonth:arrMonth,feedback:feedback});
}





module.exports = { addContractorWorker , getContractorWorkerById , deleteContractorWorkerById
    , getAllContractorWorkers , getContractorWorkerByMail , loginUser , addDateToUnavailabilityarray
    , addUn , getContractorByEmail , editProfileDisplay , editProfile , updateContractorPass , unDisplay 
    , homepageDisplay , findContractorInSpecDate , contractorFuture , contractorHistory , endEmployement
    , startEmployement ,contractorWaitApproval , approveShift , cancelShift , payChecksList , payCheck 
    , messageList , sendMessage , sendMessageDiplay , jobRateDisplay };

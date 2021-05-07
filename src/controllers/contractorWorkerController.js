const ContractorWorker=require('../model/contractorWorker')
const Unavailability=require('../model/unavailabilityContractor')
const nodemailer=require('nodemailer')
const jwt = require('jsonwebtoken')
var mongo=require('mongodb');
var assert=require('assert');

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
        console.log('add conrtactor');
        addUnavailabilityArray(contractorWorker._id)//הוספת מערך חופשות ריק
        salaryOfHour(contractorWorker._id,contractorWorker.birthday);
        //console.log('what',salaryOfHour(req.body.birthday));
        // hourlyWage=salaryOfHour(req.body.birthday);
        res.redirect('/contractorWorker/contractorHomepage');
    }).catch(err=>{
        console.log(`can not add this worker! ${err}`);
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

const addUn=(req,res)=>{//פונקציה מפעילה את הכל- מקבלת בניתוב אידי של אי זמינות
    addDateToUnavailabilityarray(req.params.id,req.body.start,req.body.end);   
}


//מקבל תאריך התחלה וסוף ומוסיף את כל הימים האלו למערך החופשות של העובד
const addDateToUnavailabilityarray=(idArray,startDate,endDate)=>{// בהנחה שהתאריכים עוקבים
    var m=[31,29,31,30,31,30,31,31,30,31,30,31];
    var i; 
    var s=new Date(startDate);
    var e=new Date(endDate);   
    var start=s.getDate();//מחזיר את היום 1-31
    //console.log("s: "+start);
    var end=e.getDate();
    //console.log("e: "+end);
    //console.log("month: "+e.getMonth() );   
    //console.log("month: "+s.getMonth() ); 
    if(s.getMonth()!=e.getMonth()){
        
        for(i=start+1;i<=m[s.getMonth()];i++){
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
            //console.log("if first for "+i);            
        }
        for(i=1;i<=end+1;i++){
            addDateToArray(idArray,s.getFullYear(),e.getMonth(),i);
            //console.log("if second for "+i); 
        }
    }
    else{
        for(i=start+1;i<=end+1;i++){
            addDateToArray(idArray,s.getFullYear(),s.getMonth(),i);
            //console.log("if 3 for "+i); 
        }
    }
}



//מחזיר מערך אידי של עובדים שתפוסם בתאריכים אלו
// const findContractorInSpecDate=(req,res)=>{
//     var array=[];
//     var i=0;
//     Unavailability.find( {unavailabArray : { $in: [req.body.date] }}).then(unavailability=>{  
//         res.send({contractors:unavailability});        
//         for(i=0;i<unavailability.length;i++){
//             array[i]=unavailability[i].contractorId;
//         }
//         console.log(array);    
//         return array;  
//     }).catch(err=>{
//         console.log(err);
//     })
// }



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
    ContractorWorker.findOne({ mail: req.body.mail }).then(ContractorWorker=>{
        console.log("in login");
        const token=jwt.sign({mail: ContractorWorker.mail, password: ContractorWorker.password}, process.env.SECRET);
        res.send(token);
    }).catch(err=>{
        console.log(err);
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
    ,getAllContractorWorkers,getContractorWorkerByMail,updateContractorWorkerByMail,loginUser,addDateToUnavailabilityarray
    ,addUn };


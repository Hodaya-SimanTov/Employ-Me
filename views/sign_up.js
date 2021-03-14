// function checkDetails(){
//     windows.alert("good details!");
//     return true;
// }

exports.checkName={
    function (a,b){
    //var name=document.getElementById("name").value;
       return a+b;
    }
}



// function checkEmail(email){
//     //var email=document.getElementById("email").value;
//     if(email==""){
//         alert("Please enter an email");
//         return false;
//     }
//     return true;
//     // else{
//     //     if(email.includes("@")==false){
//     //         alert("Invalid email");
//     //     }
//     // } 
// }

// function checkPassword(pass) {
//     //pass=document.getElementById("pass").value;
//     if(pass==""){
//         alert("Please enter a password");
//         return false;
//     }
//     return true;
// }

function checkRePass(){
    pass=document.getElementById("password").value;
    rePass=document.getElementById("rePassword").value;
    if(rePass==""){
        alert("Please confirm the password");
    }
    else{
        if(rePass!=pass){
            alert("Invalid password verification");
           
        }
    }
   
}    
    

// //module.exports=checkName();
// module.exports=checkEmail();
// module.exports=checkPassword();
// module.exports=checkRePass();

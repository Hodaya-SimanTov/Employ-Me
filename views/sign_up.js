// function checkDetails(){
//     windows.alert("good details!");
//     return true;
// }

// exports.checkName={
//     function (a,b){
//     //var name=document.getElementById("name").value;
//        return a+b;
//     }
// }



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

function checkPassword() {
    pass=document.getElementById("password").value;
    if(pass.length<6){
        alert("A valid password contains at least 6 characters");
        return false;
    }
    return true;
}

function checkRePass(){
    pass=document.getElementById("password").value;
    rePass=document.getElementById("rePassword").value;
    if(rePass!=pass){
        alert("Invalid password verification");
        return false;
    }
    return true;   
}    
    

// //module.exports=checkName();
// module.exports=checkEmail();
// module.exports=checkPassword();
// module.exports=checkRePass();

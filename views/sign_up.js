function signup(){ 
    var name=document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pass=document.getElementById('password').value;
    var rePass=document.getElementById('rePassword').value;
    if(!/^[a-zA-Z]+$/.test(name))
        alert('Name is invalid');
    else
        if (pass.length <6)
            alert('Password is invalid,\npassword must contain at least 6 characters');
        else 
             if(rePass==""){
                alert('Please confirm the password');
            }
            else{
                if(rePass!=pass){
                    alert('Invalid password verification');
                }
            } 
}  
module.exports=signup();

<<<<<<< HEAD
=======
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
>>>>>>> 5320f02eb49beec1581d8c4c3e3533e70e790ad0

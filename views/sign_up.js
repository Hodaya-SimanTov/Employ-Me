function signup(){ 
    var name=document.getElementById("name").value;
    var email = document.getElementById('email').value;
    var pass=document.getElementById('password').value;
    var rePass=document.getElementById('rePassword').value;
    if(!/^[a-zA-Z]+$/.test(name))
        alert('Name is invalid');
    else
        if (pass.length <6)
            alert('Password is invalid,\npassword must contain at least 6 characters');
        else 
             if(rePass==''){
                alert('Please confirm the password');
            }
            else{
                if(rePass!=pass){
                    alert('Invalid password verification');
                }
            } 
}  
module.exports=signup();




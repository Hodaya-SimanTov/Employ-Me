<<<<<<< HEAD
function signup(){ 
    var name=document.getElementById("name").value;
    var pass=document.getElementById("password").value;
    var rePass=document.getElementById("rePassword").value;
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
                    alert("Invalid password verification");
                }
            }
}
module.exports={signup}
=======
// var firebaseConfig = {
//     apiKey: "AIzaSyAYFylGCNTuv_WPEn6YN9QaK3B7utgLwns",
//     authDomain: "employ-me-6f74e.firebaseapp.com",
//     projectId: "employ-me-6f74e",
//     storageBucket: "employ-me-6f74e.appspot.com",
//     messagingSenderId: "403952758032",
//     appId: "1:403952758032:web:3fb3b238c7ffd59d78c995",
//     measurementId: "G-V57RLMYD39"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

>>>>>>> c19e33e0830956dfdc69d170b5255bc2c4fd2128

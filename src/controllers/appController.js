module.exports = function(app){
    app.get('/',(req,res)=>{
        res.render('homepage')
        
    });
    app.get('/login',(req,res)=>{
        res.render('login')
    });
    app.get('/signup',(req,res)=>{
        res.render('sign_up')
    });
}

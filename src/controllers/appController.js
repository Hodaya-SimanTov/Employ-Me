module.exports = function(app){
    app.get('/',(req,res)=>{
        res.render('login')
    });
    app.get('/homepage',(req,res)=>{
        res.render('homepage')
    });
    app.get('/sign-up',(req,res)=>{
        res.render('sign_up')
    });
}

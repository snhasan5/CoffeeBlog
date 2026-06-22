module.exports.getLoginPage = (req, res, next) => {

    res.render('auth/login',{
        pageTitle: 'Login Now',
        activePage : '/login',
    })
};

module.exports.getSignupPage = (req,res,next)=>{
    res.render('auth/signup',{
        pageTitle : 'Sign Up',
        activePage : '/signup'
    })
}
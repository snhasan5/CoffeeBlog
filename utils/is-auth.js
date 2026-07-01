module.exports = (req,res,next)=>{
    if(!req.session.isLoggedIn) {
        if (req.accepts("json") && !req.accepts("html")) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        return res.redirect('/login'); 
    }
        
    else next()
}

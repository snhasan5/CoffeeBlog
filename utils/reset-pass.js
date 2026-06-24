const {Resend} = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendResetEmail = (email,token)=>{
    return resend.emails.send({
        from: 'Coffee Blog <onboarding@resend.dev>',
        to : email,
        subject : 'Password Reset',
        html : `
                <h2>Password Reset</h2>
                <p>You requested a password reset.</p>
                <p>Click this link to reset your password:</p>
                <a href="http://localhost:3000/reset/${token}">Reset Password</a>
               `
    })
}
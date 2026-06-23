const { Resend } = require('resend');

exports.sendWelcomeEmail = (email, name) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send({
        from: 'Coffee Blog <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Coffee Blog ☕',
        html: `
            <h2>Welcome ${name || 'there'}!</h2>
            <p>Thank you for signing up to Coffee Blog.</p>
            <p>We hope you enjoy sharing your coffee journey with us!</p>
        `
    });
};
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        console.log('📧 Attempting to send email to:', options.to);
        console.log('📧 SMTP Config:', { 
            host: process.env.SMTP_HOST, 
            port: process.env.SMTP_PORT, 
            user: process.env.SMTP_USER ? 'Set' : 'Missing',
            pass: process.env.SMTP_PASS ? 'Set' : 'Missing'
        });

        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.error('❌ SMTP not configured correctly in .env');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const message = {
            from: `"VendorVigil Monitor" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        return false;
    }
};

module.exports = sendEmail;

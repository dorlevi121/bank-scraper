import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.FORGOT_PASSWORD_EMAIL,
                pass: process.env.FORGOT_PASSWORD_EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.FORGOT_PASSWORD_EMAIL,
            to: email,
            subject: subject,
            html: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

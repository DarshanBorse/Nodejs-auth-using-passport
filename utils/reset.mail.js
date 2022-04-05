import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const ResetMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve(__dirname, "../template"),
                defaultLayout: false,
            },
            viewPath: path.resolve(__dirname, "../template"),
        };

        transporter.use('compile', hbs(handlebarOptions))

        await transporter.sendMail({
            from: process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: subject,
            text: text,
            template: 'mail',
            context: {
                link: text
            }
        }, (err, info) => {
            if (err) {
                console.log(err);
            }
            console.log(info);
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default ResetMail;
import { createTransport } from 'nodemailer'
import { consola } from 'consola';

const { Server, Password, User, Sender } = useRuntimeConfig()

const transporter = createTransport({
    host: Server,
    port: 587,
    secure: false,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    auth: {
        user: User,
        pass: Password
    }
});

transporter.verify((error) => {
    if (error) consola.error('Server is not ready to send mail', error);
    else consola.success('Server is ready to send mail');
});

export default async (options: any) => {
    const { recepient, subject, body } = options

    const mailOptions = {
        from: Sender,
        to: recepient,
        subject: subject,
        html: body,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) consola.error('Email not sent: ', error);
        else consola.success('Email sent: ', info.response);
    });

};
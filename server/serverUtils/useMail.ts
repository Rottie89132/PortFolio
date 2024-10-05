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
    },
});

transporter.verify((error) => {
    if (error) consola.error('Server is not ready to send mail', error.message);
    else consola.success('Server is ready to send mail');
});

type reponseType = {
    success: boolean | null,  
    error: null | Error
}

export default async (options: any) => {
    const { recepient, subject, body } = options

    const response: reponseType = {
        success: null,
        error: null 
    }

    const mailOptions = {
        from: Sender,
        to: recepient,
        subject: subject,
        html: body,
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return reject(error);
            resolve(info);
        });
    })

    .then((info: any) => {
        consola.success('Email sent: ', info.response);
        response.success = true
    })
    
    .catch((error) => {
        consola.error('Email not sent: ', error.message);
        response.error = error
    });

    return response

};
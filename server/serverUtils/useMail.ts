import { createTransport } from 'nodemailer'
import { consola } from 'consola';
import chalk from 'chalk';

const { Server, Password, User, Sender } = useRuntimeConfig()

const transporter = createTransport({
    host: Server,
    port: 587,
    secure: false,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: User,
        pass: Password
    }
});

transporter.verify((error) => {
    if (error) consola.error(chalk.red('✖') + ' Server is not ready to send mail');
    else consola.success(chalk.green('✔') + ' Server is ready to send mail');
});

export default async (options: any) => {
    const { recepient, subject, body } = options

    const mailOptions = {
        from: Sender,
        to: recepient,
        subject: subject,
        html: body.html,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) consola.error(chalk.red('✖') + ' Email not sent: ' + error);
        else consola.success(chalk.green('✔') + ' Email sent: ' + info.response);
    });

};
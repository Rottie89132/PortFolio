import UseEmail from '~~/components/emails/success.vue'
import { render } from '@vue-email/render'

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const request = await readBody(event)
            if (!request) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The server could not understand the request due to invalid syntax."
            })

            const { token } = request
            if (!token) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The server could not understand the request due to invalid syntax."
            })

            const user: Record<string, any> | null = await useStorage("VerifyRequired").getItem(token)
            if (!user) return reject({
                statusCode: 410,
                statusMessage: "Gone",
                message: "The requested resource is no longer available at the server and no forwarding address is known."
            })

            const { Email, Password, Username } = user
            const newUser: Record<string, any> = await User.create({
                Email, Password, Username,
            })

            const response = {
                user: {
                    Id: newUser._id,
                    Email: newUser.Email,
                    Username: newUser.Username,
                    Admin: newUser.Role == "Eigenaar",
                    is2FAEnabled: newUser.TwoFactorSecret ? true : false
                }
            }

            const template = await render(UseEmail, {
                Username: newUser.Username
            })

            await useMail({
                recepient: newUser.Email,
                subject: "Account aangemaakt!",
                body: template
            })

            await useStorage("VerifyRequired").removeItem(token)
            useUserStorage(event, response)
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })

        }, 7700);
    });
})

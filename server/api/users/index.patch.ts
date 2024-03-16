import bcrypt from "bcrypt"
export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {

            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
            const request = await readBody(event)

            if (!request) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })

            const { confirmatie, wachtwoord } = request
            if (!confirmatie || !wachtwoord) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })

            if (confirmatie !== wachtwoord) return reject({
                statusCode: 422,
                statusMessage: "Unprocessable Entity",
                message: "The request was well-formed but was unable to be followed due to semantic errors."
            })

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })
            
            await User.findOneAndUpdate({ _id: user.Id }, { Password: bcrypt.hashSync(wachtwoord, 5) })

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })
        }, 1000)
    });
    
})

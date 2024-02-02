import bcrypt from "bcrypt"
export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "token")
            const user: any = await useStorage("Sessions").getItem(SessionId)
            const request = await readBody(event)

            if (!request) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })

            const { Naam, Email } = request
            if (!Naam && !Email) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })
            
            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request requires user authentication."
            })

            if (Naam) await User.findOneAndUpdate({ _id: user.Id }, { Username: Naam }).catch((err) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
                })
            })
            if (Email) await User.findOneAndUpdate({ _id: user.Id }, { Email: Email })

            const AuthUser: any = await User.findById(user.Id);

            const data = {
                user: {
                    Id: AuthUser._id,
                    Email: AuthUser.Email,
                    Username: AuthUser.Username,
                    Admin: AuthUser.Role == "Eigenaar",
                    is2FAEnabled: AuthUser.TwoFactorSecret ? true : false
                }
            }

            await useStorage("Sessions").setItem(SessionId, data.user)

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
                user: {
                    Email: AuthUser.Email,
                    Username: AuthUser.Username,
                }
            })
        }, 500)
    });
    
})

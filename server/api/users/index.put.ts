export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
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
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            if (Naam) await User.findOneAndUpdate({ _id: user.Id }, { Username: Naam }).catch((err) => {
                return reject({
                    statusCode: 409,
                    statusMessage: "Conflict",
                    message: "The request could not be completed due to a conflict with the current state of the target resource.",
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
        }, 1000)
    });

})

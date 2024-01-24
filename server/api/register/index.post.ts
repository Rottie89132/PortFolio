import bcrypt from "bcrypt"

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const request = await readBody(event)
        if(!request) return reject({
            statusCode: 400, 
            statusMessage: "Bad Request", 
            message: "The server could not understand the request due to invalid syntax."
        })

        const { email, wachtwoord, confirmatie } = request
        if (!email && !wachtwoord && !confirmatie) return reject({
            statusCode: 400, 
            statusMessage: "Bad Request", 
            message: "The server could not understand the request due to invalid syntax."
        })

        if (wachtwoord !== confirmatie) return reject({
            statusCode: 422, 
            statusMessage: "Unprocessable Entity",
            message: "The request was well-formed but was unable to be followed due to semantic errors."
        })

        const available = await User.find({ Email: email })

        if (available.length > 0) return reject({
            statusCode: 409, 
            statusMessage: "Conflict",
            message: "The request could not be completed due to a conflict with the current state of the target resource."
        })

        const user: any = await User.create({
            Email: email,
            Password: bcrypt.hashSync(wachtwoord, 5),
            Username: email.split("@")[0],
        })

        const response = {
            user: {
                Id: user._id,
                Email: user.Email,
                Username: user.Username,
                Admin: user.Role == "Eigenaar",
                is2FAEnabled: user.TwoFactorSecret ? true : false
            }
        }

        useUserStorage(event, response)
        
        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })

    });

})

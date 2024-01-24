import bcrypt from "bcrypt"
export default async (event: any,) => {
    const request = await readBody(event)
    if (!request) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "The request could not be understood by the server due to malformed syntax."
    }

    const { email, wachtwoord } = await readBody(event)
    if (!email || !wachtwoord) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "The request could not be understood by the server due to malformed syntax."
    }

    const user: Record<string, any> | null = await User.findOne({ Email: email })
    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been authorized because it lacks valid authentication credentials."
    }

    const passwordMatch = await bcrypt.compare(wachtwoord, user.Password)
    if (!passwordMatch) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been authorized because it lacks valid authentication credentials."
    }


    return {
        statusCode: 200,
        statusMessage: "OK",
        user: { 
            Id: user._id,
            Email: user.Email,
            Username: user.Username,
            Admin: user.Role == "Eigenaar",
            is2FAEnabled: user.TwoFactorSecret ? true : false
        }
    }
}


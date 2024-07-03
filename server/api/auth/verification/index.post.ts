import { authenticator } from 'otplib';
import consola from 'consola';
import crypto from 'crypto';
export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "OptRequired")
        const user: any = await useStorage("OptRequired").getItem(SessionId)

        if (!user) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "No valid session found."
        })

        const request = await readBody(event)
        const { token } = request;

        const hash = crypto.createHash('sha1').update(SessionId).digest('hex');
        const response: any = await User.findOne({ Email: user.Email })
        const secret = response.TwoFactorSecret;
        const isValid = authenticator.verify({ token, secret });

        if (!isValid) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "Invalid token."
        })

        const UserResponse = {
            user: {
                Id: response._id,
                Email: response.Email,
                Username: response.Username,
                Admin: response.Role == "Eigenaar",
                is2FAEnabled: response.TwoFactorSecret ? true : false
            }
        }

        useUserStorage(event, UserResponse)
        await useStorage("OptRequired").removeItem(SessionId)
        deleteCookie(event, "OptRequired")

        consola.success("2FA Token verified", hash)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "OK",
            user: {
                Id: response._id,
                Email: response.Email,
                Username: response.Username,
                Admin: response.Role == "Eigenaar" ? true : false,
                is2FAEnabled: response.TwoFactorSecret ? true : false
            }
        })
    })
});


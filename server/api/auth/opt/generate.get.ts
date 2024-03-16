import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        
        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })
        
        const secret = authenticator.generateSecret();
        await User.findByIdAndUpdate(user.Id, { $set: { TwoFactorSecret: secret } });

        const TwoFaUser: any = await User.findById(user.Id);
        const otpauth = authenticator.keyuri(user.Email, 'CatFolio', secret);
        const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

        const data = {
            user: {
                Id: TwoFaUser._id,
                Email: TwoFaUser.Email,
                Username: TwoFaUser.Username,
                Admin: TwoFaUser.Role == "Eigenaar",
                is2FAEnabled: TwoFaUser.TwoFactorSecret ? true : false
            }
        }

        await useStorage("Sessions").setItem(SessionId, data.user)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "OK",
            Secret: secret,
            qrCodeDataUrl: qrCodeDataUrl
        })
    });
});
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "token")
    const user: any = await useStorage("Sessions").getItem(SessionId)

    if (!user) return{
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been authorized because it lacks valid authentication credentials."
    }

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

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "OK",
        Secret: secret,
        qrCodeDataUrl: qrCodeDataUrl
    }


});
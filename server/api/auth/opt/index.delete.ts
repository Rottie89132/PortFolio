export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null  = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })
        
        await User.findByIdAndUpdate(user.Id, { $set: { TwoFactorSecret: null } })
        const UserData: any = await User.findById(user.Id)
        
        const data = {
            user: {
                Id: UserData._id,
                Email: UserData.Email,
                Username: UserData.Username,
                Admin: UserData.Role == "Eigenaar",
                is2FAEnabled: UserData.TwoFactorSecret ? true : false
            }
        }

        await useStorage("Sessions").setItem(SessionId, data.user)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "OK",
        })
    });
});
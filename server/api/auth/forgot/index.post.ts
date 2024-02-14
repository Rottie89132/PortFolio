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

            const user: Record<string, any> | null = await useStorage("VerifyReset").getItem(token)
            if (!user) return reject({
                statusCode: 410,
                statusMessage: "Gone",
                message: "The requested resource is no longer available at the server and no forwarding address is known."
            })

            const newUser: Record<string, any> | null = await User.findOneAndUpdate({ Email: user.Email }, 
                { $set: { Password: user.Password } }, { new: true }) as Record<string, any>;
                        
            const response = {
                user: {
                    Id: newUser?._id,
                    Email: newUser?.Email,
                    Username: newUser?.Username,
                    Admin: newUser?.Role == "Eigenaar",
                    is2FAEnabled: newUser?.TwoFactorSecret ? true : false
                }
            }

            await useStorage("VerifyReset").removeItem(token)
            useUserStorage(event, response)
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })

        }, 500);
    });
});

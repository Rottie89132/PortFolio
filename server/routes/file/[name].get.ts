import path from 'path'
import fs from "fs";

export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
        const SessionId: any = getCookie(event, "token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been authorized because it lacks valid authentication credentials."
        })

        const base = "Resources";
        const filePath = path.join(base, getRouterParams(event).name);

        if (!fs.existsSync(filePath)) {
            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The server has not found anything matching the Request-URI."
            })
        }

        return resolve(sendStream(event, fs.createReadStream(filePath)))
    });

});


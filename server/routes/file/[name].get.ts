import path from 'path'
import fs from "fs";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const SessionId: any = getCookie(event, "access-token")
        const refreshId: any = getCookie(event, "refresh-token")

        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (!user) {
            const { data, error } = await useRefreshSession(event, {
                Session: SessionId, Refresh: refreshId
            })

            if (error) return reject({
                statusCode: error.statusCode,
                statusMessage: error.statusMessage,
                message: error.message
            })
        }
        
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


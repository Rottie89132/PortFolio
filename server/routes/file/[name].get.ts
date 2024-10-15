import path from 'path'
import fs from "fs";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        
        const base = "Resources";
        const filePath = path.join(base, getRouterParams(event).name);

        if (!fs.existsSync(filePath)) {
            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The server has not found anything matching the Request-URI."
            })
        }

        await FileLog.create({
            FileName: getRouterParams(event).name,
            FileIp: await useIP(event),
        })

        return resolve(sendStream(event, fs.createReadStream(filePath)))
    });

});


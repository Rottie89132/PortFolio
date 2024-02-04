import path from 'path'
import fs from "fs";

export default defineEventHandler(async (event) => {
    const base = "Resources";
    const filePath = path.join(base, getRouterParams(event).name);

    if (!fs.existsSync(filePath)) {
        return {
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The server has not found anything matching the Request-URI."
        }
    }

    return sendStream(event, fs.createReadStream(filePath))
});


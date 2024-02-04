import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been authorized because it lacks valid authentication credentials."
        })

        if (!user.Admin) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "The server understood the request but refuses to authorize it."
        })

        const files: any = await readMultipartFormData(event)
        const uploadedFilePaths: string[] = []

        files.forEach((file: any) => {

            if (file.data.length > 5000000) return reject({
                statusCode: 413,
                statusMessage: "Payload Too Large",
                message: "The server is refusing to process a request because the request payload is larger than the server is willing or able to process."
            })

            if (file.type != "application/pdf") return reject({
                statusCode: 415,
                statusMessage: "Unsupported Media Type",
                message: "The server is refusing to service the request because the payload is in a format not supported by this method on the target resource."
            })

            if (!fs.existsSync(path.join(process.cwd(), 'public', 'informatie'))) {
                fs.mkdirSync(path.join(process.cwd(), 'public', 'informatie'), { recursive: true });
            }

            const filePath = path.join(process.cwd(), 'public', "informatie", "RM-cv.pdf")
            fs.writeFileSync(filePath, file.data)
            uploadedFilePaths.push("/informatie/RM-cv.pdf")
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
        })

    })
})

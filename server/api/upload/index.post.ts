import path from 'path'
import fs from 'fs'

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
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

                if (file.type !== "application/pdf") return reject({
                    statusCode: 415,
                    statusMessage: "Unsupported Media Type",
                    message: "The server is refusing to service the request because the payload is in a format not supported by this method on the target resource."
                })

                if (!fs.existsSync(path.join(process.cwd(), 'Resources'))) {
                    fs.mkdirSync(path.join(process.cwd(), 'Resources'), { recursive: true });
                }

                const extension = path.extname(file.filename);
                const filePath = path.join(process.cwd(), 'Resources', `roland-cv${extension}`)
                fs.writeFileSync(filePath, file.data)
                uploadedFilePaths.push(filePath)
            })

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
            })
        }, 2000);
    })
})

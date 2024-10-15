
import { defineMongooseModel } from "#nuxt/mongoose";

export const FileLog = defineMongooseModel({
    name: 'FileLog',
    schema: {
        FileName: { type: String, required: true, unique: false },
        FileIp: { type: String, required: true, unique: false },
        FileLookedAt: { type: Date, required: false, default: Date.now },
    }
})






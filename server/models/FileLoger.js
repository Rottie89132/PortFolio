
import { defineMongooseModel } from "#nuxt/mongoose";

export const FileLog = defineMongooseModel({
    name: 'FileLog',
    schema: {
        UserID: { type: String, required: true, unique: false },
        UserEmail: { type: String, required: true, unique: false },
        UserIp: { type: String, required: true, unique: false },
        LookedAt: { type: Date, required: false, default: Date.now },
    }
})






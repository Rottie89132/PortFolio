
import { defineMongooseModel } from "#nuxt/mongoose";

export const GitUser = defineMongooseModel({
    name: 'GitUser',
    schema: {
        UserID: { type: String, required: true, unique: true },
        AccessToken: { type: String, required: true, unique: false },
        installationId: { type: String, required: true, unique: false },
        createdAt: { type: Date, required: true, unique: false },
        expiresAt: { type: Date, required: true, unique: false }
    }
})






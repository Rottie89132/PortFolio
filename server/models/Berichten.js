
import { defineMongooseModel } from "#nuxt/mongoose";

export const Berichten = defineMongooseModel({
    name: 'Messages',
    schema: {
        name: { type: String, required: true, unique: false },
        email: { type: String, required: true, unique: false },
        message: { type: String, required: true, unique: false },
        phone: { type: String, required: false, unique: false },
        read: { type: Boolean, required: false, default: false },
        created_at: { type: Date, required: false, default: Date.now },
    }
})



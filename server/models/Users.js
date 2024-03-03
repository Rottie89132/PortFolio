
import { defineMongooseModel } from "#nuxt/mongoose";

export const User = defineMongooseModel({
    name: 'User',
    schema: {
        Username: { type: String, required: true, unique: true },
        Password: { type: String, required: true, unique: false },
        Email: { type: String, required: true, unique: true },
        Role: { type: String, required: false, default: "Bezoeker" },
        TwoFactorSecret: { type: String, required: false, default: null },
        CreatedAt: { type: Date, required: false, default: Date.now }
    }
})






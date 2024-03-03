
import { defineMongooseModel } from "#nuxt/mongoose";

export const analytics = defineMongooseModel({
    name: 'analytics',
    schema: {
        CurrentYear: { type: Number, required: true, unique: false },
        CurrentMonth: { type: Number, required: true, unique: false },
        MonthlyVisted: { type: Number, required: false, default: 0 },
    }
})






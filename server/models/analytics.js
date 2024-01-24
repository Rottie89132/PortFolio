
import { defineMongooseModel } from "#nuxt/mongoose";

export const analytics = defineMongooseModel({
    name: 'analytics',
    schema: {
        CurrentMonth:   { type: Number,     required: true,     unique: true  },
        MonthlyVisted:  { type: Number,     required: false,    default: 0    },
    }
})






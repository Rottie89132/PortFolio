
import { defineMongooseModel } from "#nuxt/mongoose";

export const Information = defineMongooseModel({
    name: 'Information',
    schema: {
        title: { type: String, required: true, unique: false },
        content: { type: String, required: true, unique: false },
        action: { type: String, required: true, unique: false },  
    }
})






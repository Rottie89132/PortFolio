
import { defineMongooseModel } from "#nuxt/mongoose";

export const Repositories = defineMongooseModel({
    name: 'Repositories',
    schema: {
        repo_id:        {   type: Number,  required: true,     unique: true     },
        name:           {   type: String,  required: true,     unique: false    },
        full_name:      {   type: String,  required: true,     unique: false    },
        description:    {   type: String,  required: false,    unique: false    },
        html_url:       {   type: String,  required: false,    unique: false    },
        homepage:       {   type: String,  required: false,    unique: false    },
        visibility:     {   type: String,  required: true,     unique: false    },
        topics:         {   type: Array,   required: false,    unique: false    },
        owner: {
            name:       {   type: String,  required: true,     unique: false    },
            avatar_url: {   type: String,  required: true,     unique: false    },
            html_url:   {   type: String,  required: true,     unique: false    }
        },
        updated_at:     {   type: Date,    required: false,    unique: false    },
        created_at:     {   type: Date,    required: true,     unique: false    },
    }
})



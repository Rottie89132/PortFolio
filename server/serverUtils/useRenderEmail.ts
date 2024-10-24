import UseEmail from '~/components/emails/Request.vue'
import UseEmailPerson from '~/components/emails/received.vue'
import { render } from '@vue-email/render'
const config = useRuntimeConfig()

export default async (data: any): Promise<reponseType> => {

    return new Promise(async (resolve, reject) => {
        const response: reponseType = {
            success: null,
            error: null
        }

        const templateData = useTemplate(data)
        const templateUrl = useMakeUrl(data)

        const template = await render(templateData, {
            naam: data.name,
            email: data.email,
            bericht: data.message,
            telefoon: data.phone,
            url: templateUrl
        })

        const { error } = await useMail({
            recepient: data.email,
            subject: "Contactverzoek ontvangen",
            body: template
        })

        if (error) {
            response.error = error
            return reject(response)
        }

        response.success = true
        return resolve(response)

    })

}

const useMakeUrl = (data: Record<string, any>) => {
    if (data.type == 0) return `${config.Hostadress}/dashboard/berichten/${data.id}`
    return `${config.Hostadress}/berichten/${data.id}`
}

const useTemplate = (data: any) => {
    if (data.type == 0) return UseEmail
    return UseEmailPerson
}
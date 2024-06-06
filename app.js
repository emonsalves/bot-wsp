const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { chat } = require('./scripts/chatGpt.js')

const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido a este chatbot')

const flowAmor = addKeyword(["amor"])
    .addAnswer("Hola, BB, ¿Cómo estás? ¿En qué puedo ayudarte?")

const flowHora = addKeyword(["hora"])
    .addAnswer("La hora actual es: " + new Date().toLocaleTimeString())

const flowSaludo = addKeyword('hola')
    .addAnswer('Hola como estas?', null, async (ctx) => { console.log(ctx) })

const flowDocumento = addKeyword(EVENTS.DOCUMENT)
    .addAnswer('Documento PDF recibido')

const flowLocation = addKeyword(EVENTS.LOCATION)
    .addAnswer('Ohh ya veo donde estas')

const flowNotaDeVoz = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer('Dame un momento para escuchar la nota de voz')

const flowRecibirMedia = addKeyword(EVENTS.MEDIA)
    .addAnswer('He recibido tu foto o video')

const flowLlamar = addKeyword('llamar')
    .addAnswer('Te llamaremos en breve')
    .addAction(async (ctx) => console.log(`Estan llamando desde: ${ctx.from}`))

const flowEmail = addKeyword('email')
    .addAction(async (_, { flowDynamic }) => {
        return await flowDynamic('Por favor, ingresa tu email')
    })
    .addAction({ capture: true }, async (ctx, { flowDynamic }) => {
        const mensaje = ctx.body
        return await flowDynamic(`Tu email es: ${mensaje}`)
    })

// #region ConexionOpenAI
const flowOpenAi = addKeyword("ia")
    .addAction(async (ctx, ctxFn) => {
        const prompt = "¿Qué es una IA?"
        const text = ctx.body

        const conversations = []

        const contextMessages = conversations.flatMap((conversation) => [
            { role: 'user', content: conversation.question },
            { role: 'assistant', content: conversation.answer }
        ])

        contextMessages.push({ role: 'user', content: text })

        const response = await chat(prompt, contextMessages)

        await ctxFn.flowDynamic(response)
    })

// #endregion

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        // flowBienvenida,
        flowSaludo,
        flowAmor,
        flowHora,
        flowDocumento,
        flowLocation,
        flowNotaDeVoz,
        flowRecibirMedia,
        flowLlamar,
        flowEmail,
        flowOpenAi
    ])

    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

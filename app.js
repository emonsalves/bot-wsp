const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { chat } = require('./scripts/chatGpt.js')

const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
  
    const timeDifference = midnight - now;
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    return { days, hours, minutes, seconds };
  };

const flowPrincipal = addKeyword(["hola"]).addAnswer("Hola, soy un chat bot diseñado para ayudar a los usuarios a resolver sus dudas, estoy en entrenamiento, por favor, se paciente conmigo")
const flowPrincipal2 = addKeyword(["amor"]).addAnswer("Hola, BB, ¿Cómo estás? ¿En qué puedo ayudarte?")
const flowPrincipal3 = addKeyword(["enzo"]).addAnswer("recuerda quedan para la medianoche: " + calculateTimeUntilMidnight().hours + " horas, " + calculateTimeUntilMidnight().minutes + " minutos y " + calculateTimeUntilMidnight().seconds + " segundos")

// #region OpenAI
// const flowPrincipal = addKeyword(EVENTS.WELCOME)
// .addAction(async (ctx, ctxFn) => {
//     const prompt = "Soy un chat bot diseñado para ayudar a los usuarios a resolver sus dudas";
//     const text = ctx.body;

//     const conversations = [];

//     // Crea el contexto con las operaciones 
//     const contextMessages = conversations.flatMap((conv) => [
//         { role: "user", content: conv.question },
//         { role: "assistant", content: conv.answer }
//     ]);

//     // Añadir la pregunta al contexto
//     contextMessages.push({ role: "user", content: text });

//     // Obtener la respuesta de OpenAI
//     const response = await chat(prompt, contextMessages);

//     // Enviar la respuesta al usuario
//     await ctxFn.flowDynamic(response);
// });
// #endregion

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        flowPrincipal,
        flowPrincipal2,
        flowPrincipal3
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

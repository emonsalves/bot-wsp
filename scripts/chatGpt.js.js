require("dotenv").config();
const OpenAI = require("openai");

const openaiApiKey = process.env.OPENAI_API_KEY;

const chat = async (prompt, messages) => {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt },
                ...messages
            ],
        });
        console.log(completion);
        const answ = completion.choices[0].message.content;
        return answ;
    }
    catch (error) {
        console.error("Error al conectar con OpenAI", error);
        return "Error al conectar con OpenAI";
    }
}

module.exports = { chat }
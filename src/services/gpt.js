// src/services/openai.ts
import OpenAI from "openai";
import config from '../config/config.js';

const openai = new OpenAI({
  apiKey: "lm-studio", // cualquier string, LM Studio no valida API Key
  baseURL: config.lmStudioHost, // el servidor local de LM Studio
});

export async function askChatbot(message) {
  const completion = await openai.chat.completions.create({
    model: "local-model", // LM Studio ignora el nombre, pero pon algo
    messages: [
      { role: "system", content: "Eres un asistente útil, que tiene experiencia en administracion de empresas y su creacion desde cero" },
      { role: "user", content: message }
    ],
    temperature: "0.7",
  });

  return completion.choices[0].message?.content ?? "";
}

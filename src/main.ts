import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { parseArgs } from "node:util";

config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const { values } = parseArgs({
    options: {
        prompt: { type: "string", short: "p" },
        mode: { type: "string", short: "m", default: "gemini-3.8-flash" },
    }
});

if (!values.prompt) {
    console.error(`No Prompt Entered`);
    process.exit(1);
}

const response = await ai.models.generateContent({
    model: values.mode,
    contents: values.prompt,
});

console.log(response.text);
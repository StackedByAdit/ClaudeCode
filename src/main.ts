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

const stream = await ai.models.generateContentStream({
    model: values.mode,
    contents: values.prompt,
});

let finalChunk;
for await (const chunk of stream) {
    if (chunk.text) {
        process.stdout.write(chunk.text);
    }
    finalChunk = chunk;
}

process.stdout.write("\n");

const final = Object.assign(finalChunk ?? {}, {
    usage: {
        input_tokens: finalChunk?.usageMetadata?.promptTokenCount,
        output_tokens: finalChunk?.usageMetadata?.candidatesTokenCount,
    },
    stop_reason: finalChunk?.candidates?.[0]?.finishReason,
});

console.log(final);
console.log(final.usage.input_tokens);
console.log(final.usage.output_tokens);
console.log(final.stop_reason);
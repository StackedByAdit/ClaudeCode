import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import anthropic from "anthropic/sdk"


config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

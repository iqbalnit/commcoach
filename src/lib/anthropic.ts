import Anthropic from "@anthropic-ai/sdk";
import "server-only";

function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your .env.local file."
    );
  }
  return new Anthropic({ apiKey });
}

// Always create fresh — do NOT cache in globalThis, since the key
// may not have been in process.env when the singleton was first created.
export const anthropic = createAnthropicClient();

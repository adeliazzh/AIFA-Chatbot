import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN);

export async function chatCompletion(model, chatHistory, parameters = {}) {
  if (!import.meta.env.VITE_HF_TOKEN) {
    throw new Error(
      "Hugging Face API token is not set. Please check your .env file."
    );
  }

  try {
    const output = await client.chatCompletion({
      model: model,
      messages: chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      parameters: parameters,
    });
    return output.choices[0].message.content;
  } catch (error) {
    console.error("Error from Hugging Face client:", error);
    throw new Error(`Failed to get chat completion: ${error.message}`);
  }
}
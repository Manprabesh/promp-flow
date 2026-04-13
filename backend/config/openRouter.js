// import { OpenRouter } from '@openrouter/sdk';
const openRouter = async (prompt) => {

    console.log("the prompt", prompt)
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // model: "google/gemini-2.0-flash-lite-preview-02-05:free",
                // model: "openchat/openchat-3.5-0106", 
                model: "meta-llama/llama-3-8b-instruct",
                messages: [
                    {
                        role: "system",
                        content: `
You are a content expansion assistant.

Your task:
Take a short promotional phrase and expand it into a clear, useful explanation.

Rules:
- Return ONLY valid JSON.
- Do NOT include markdown.
- Do NOT include bullet points.
- Do NOT include extra text before or after the JSON.
- "title" must be a short heading.
- "explanation" must be a clear paragraph in plain text.
- "branches" must be an array of related subtopics the user can explore next.
- "branches" should contain short strings only.

Return exactly in this format:
{
  title: string,
  explanation: string,
  branches: [string, string, string]
} in valid json
`
                    },
                    { role: "user", content: prompt }
                ],
            }),
        });

        const data = await res.json();

        return data.choices[0].message.content;

    } catch (error) {
        console.error("OpenRouter error:", error);
        throw error;
    }
}
export default openRouter




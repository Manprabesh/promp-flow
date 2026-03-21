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
                        content: "Expand short promotional phrases into a clear paragraph . No markdown, no symbols like *, no bullet points. Plain text only."
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




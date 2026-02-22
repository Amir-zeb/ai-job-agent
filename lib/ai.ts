import { GoogleGenerativeAI } from "@google/generative-ai";

type AIResponse = {
    isRelevant: boolean;
    score: number;
    reason: string;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json", // Forces pure JSON output
    },
});

const myProfile = `
Full Stack MERN Developer
3+ years experience
Strong in React, Next.js, Node.js, MongoDB
Looking for remote jobs
Prefer remote or international roles
`;

export async function analyzeJobRelevance(
    description: string
): Promise<AIResponse> {
    try {
        const prompt = `
You are a strict job relevance classifier.

Return ONLY valid JSON.

Format:
{
  "isRelevant": boolean,
  "score": number between 0 and 100,
  "reason": string
}

Candidate Profile:
${myProfile}

Job Description:
${description}
`;

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        const parsed: AIResponse = JSON.parse(text);

        // Extra safety validation
        if (
            typeof parsed.isRelevant !== "boolean" ||
            typeof parsed.score !== "number" ||
            typeof parsed.reason !== "string"
        ) {
            throw new Error("Invalid AI response structure");
        }

        return parsed;
    } catch (error) {
        console.error("AI ERROR:", error);
        return {
            isRelevant: false,
            score: 0,
            reason: "AI processing failed",
        };
    }
}
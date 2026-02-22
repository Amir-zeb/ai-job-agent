import { GoogleGenerativeAI } from "@google/generative-ai";

type AIResponse = {
    isRelevant: boolean;
    score: number;
    reason: string;
};

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200,
        responseMimeType: "application/json",
    },
});

function safeParseJSON(text: string): AIResponse {
    try {
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        if (
            typeof parsed.score === "number" &&
            typeof parsed.isRelevant === "boolean" &&
            typeof parsed.reason === "string"
        ) {
            return parsed;
        }

        throw new Error("Invalid structure");
    } catch {
        return {
            score: 0,
            isRelevant: false,
            reason: "Invalid AI response",
        };
    }
}

export async function analyzeJobRelevance(
    description: string
): Promise<AIResponse> {
    try {
        if (!description) {
            return {
                score: 0,
                isRelevant: false,
                reason: "Empty job description",
            };
        }

        const lower = description.toLowerCase();

        const hasRelevantStack =
            lower.includes("react") ||
            lower.includes("node") ||
            lower.includes("next") ||
            lower.includes("javascript") ||
            lower.includes("typescript");

        if (!hasRelevantStack) {
            return {
                score: 0,
                isRelevant: false,
                reason: "No relevant JS stack mentioned",
            };
        }

        const prompt = `
You are a strict job matching assistant.

Candidate Profile:
- 5 years full stack developer
- Skills: React, Next.js, Node.js, Express, MongoDB, TypeScript, PostgreSQL
- Interested in: Remote frontend, MERN, full-stack roles
- Not interested in: Python, PHP, .NET

Rules:
- Score: 0 to 100
- isRelevant: true if score >= 60
- Be strict
- Reason max 20 words

Return ONLY JSON:
{
  "score": number,
  "isRelevant": boolean,
  "reason": string
}

Job:
${description.slice(0, 1800)}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return safeParseJSON(text);
    } catch (error) {
        console.error("AI ERROR:", error);

        return {
            isRelevant: false,
            score: 0,
            reason: "AI processing failed",
        };
    }
}
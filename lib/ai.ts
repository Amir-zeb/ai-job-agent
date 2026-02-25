import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

type AIResponse = {
    isRelevant: boolean;
    score: number;
    requestUsed: boolean;
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
    },
});

function safeParseJSON(text: string): AIResponse {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No JSON found");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            score: parsed.score ?? 0,
            isRelevant: parsed.isRelevant ?? false,
            reason: parsed.reason ?? "Invalid AI response",
            requestUsed: true,
        };
    } catch {
        return {
            score: 0,
            isRelevant: false,
            reason: "Invalid AI response",
            requestUsed: true,
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
                requestUsed: false,
                reason: "Empty job description",
            };
        }

        const lower = description.toLowerCase();

        const hasRelevantStack =
            lower.includes("javascript") ||
            lower.includes("typescript") ||
            lower.includes("react") ||
            lower.includes("next") ||
            lower.includes("node") ||
            lower.includes("express");

        if (!hasRelevantStack) {
            return {
                score: 0,
                isRelevant: false,
                requestUsed: false,
                reason: "No relevant JS stack mentioned",
            };
        }

        const prompt = `
You are a strict job matching assistant.

Candidate Profile:
- 5 years full stack developer
- Skills: React, Next.js, Node.js, Express, MongoDB, TypeScript, PostgreSQL
- Interested in: Remote frontend, MERN, onsite, hybrid, full-stack roles
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

        // const result = await model.generateContent(prompt);
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        score: { type: SchemaType.NUMBER },
                        isRelevant: { type: SchemaType.BOOLEAN },
                        reason: { type: SchemaType.STRING },
                    },
                    required: ["score", "isRelevant", "reason"],
                },
            },
        });
        console.log("🚀 ~ analyzeJobRelevance ~ result:", result)
        const text = result.response.text();
        console.log("🚀 ~ analyzeJobRelevance ~ text:", text)

        return safeParseJSON(text);
    } catch (error) {
        console.error("AI ERROR:", error);

        return {
            isRelevant: false,
            requestUsed: false,
            score: 0,
            reason: "AI processing failed",
        };
    }
}
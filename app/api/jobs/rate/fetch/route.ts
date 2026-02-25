import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { analyzeJobRelevance } from "@/lib/ai";
import AiUsage from "@/lib/models/AiUsage";

// 20 request per day limit for gemini free tier
const DAILY_LIMIT = 20;

function getTodayString() {
    return new Date().toISOString().split("T")[0];
}

export async function GET() {
    try {
        await connectDB();

        const today = getTodayString();

        let usage = await AiUsage.findOne({ date: today });

        if (!usage) {
            usage = await AiUsage.create({ date: today, count: 0 });
        }

        if (usage.count >= DAILY_LIMIT) {
            return NextResponse.json(
                { message: "Daily AI limit reached" },
                { status: 429 }
            );
        }

        // Get one unrated job
        const job = await Job.findOne({
            aiRated: false,
        }).sort({ postDate: -1 });

        if (!job) {
            return NextResponse.json({ message: "No unrated jobs found" });
        }
        const description = job.description.replace(/<[^>]*>?/gm, "")
        const aiResult = await analyzeJobRelevance(description);

        job.aiScore = aiResult.score;
        job.isRelevant = aiResult.isRelevant;
        job.aiReason = aiResult.reason;
        job.aiRated = true;

        await job.save();

        if (aiResult.requestUsed) {
            usage.count += 1;
            await usage.save();
        }

        return NextResponse.json({
            message: "Job rated successfully",
            jobId: job._id,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Rating failed", error },
            { status: 500 }
        );
    }
}
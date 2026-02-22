import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { analyzeJobRelevance } from "@/lib/ai";

export async function GET() {
    try {
        await connectDB();

        // Get one unrated job
        const job = await Job.findOne({
            aiRated: false,
        }).sort({ post_date: -1 });

        if (!job) {
            return NextResponse.json({ message: "No unrated jobs found" });
        }

        const aiResult = await analyzeJobRelevance(job.description);

        job.aiScore = aiResult.score;
        job.isRelevant = aiResult.isRelevant;
        job.aiReason = aiResult.reason;
        job.aiRated = true;

        await job.save();

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
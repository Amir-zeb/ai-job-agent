import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { analyzeJobRelevance } from "@/lib/ai";
import { JobT } from "@/app/jobs/types";

export async function GET() {
    try {
        await connectDB();

        const res = await fetch("https://remoteok.com/api");
        const data = await res.json();

        // First element is metadata, skip it
        const jobs = data.slice(1,5);

        for (const job of jobs) {
            // const aiResult = await analyzeJobRelevance(job.description);
            await Job.updateOne(
                { url: job.url },
                {
                    title: job.position,
                    company: job.company,
                    location: job.location,
                    salary: job.salary,
                    salary_min: job.salary_min,
                    salary_max: job.salary_max,
                    url: job.url,
                    post_date: new Date(job.date),
                    description: job.description,
                    source: "RemoteOK",
                    // aiScore: aiResult.score,
                    // isRelevant: aiResult.isRelevant,
                    // aiReason: aiResult.reason,
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ message: "Jobs fetched successfully", data: jobs });
    } catch (error) {
        return NextResponse.json({ error, message: "Something went wrong" }, { status: 500 });
    }

}
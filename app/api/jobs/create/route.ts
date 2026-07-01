// app/api/jobs/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Job from "@/lib/models/Job";
import DOMPurify from "isomorphic-dompurify";
import { calculateScore, isInterestJob } from "@/lib/ruleBasedAnalysis/score";

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const { title, company, location, salary, salaryMin, salaryMax, url, postDate, description, source } = body;

        if (!title?.trim()) {
            return NextResponse.json({ error: "Job title is required." }, { status: 400 });
        }
        if (!company?.trim()) {
            return NextResponse.json({ error: "Company is required." }, { status: 400 });
        }
        if (!description?.trim()) {
            return NextResponse.json({ error: "Job description is required." }, { status: 400 });
        }

        const _d = DOMPurify.sanitize(description);
        // deterministic score
        const ruleBasedScore = calculateScore(_d);

        const job = await Job.create({
            title: title.trim(),
            company: company.trim(),
            location: location?.trim() || "",
            salary: salary?.trim() || "",
            salaryMin: salaryMin?.trim() || "",
            salaryMax: salaryMax?.trim() || "",
            url: url?.trim() || "",
            postDate: postDate ? new Date(postDate) : undefined,
            description: _d,
            source: source?.trim() || "manual",
            isRelevant: isInterestJob(ruleBasedScore),
            ruleBasedScore: ruleBasedScore
        });

        return NextResponse.json({ success: true, jobId: job._id }, { status: 201 });
    } catch (err) {
        console.error("[create-job]", err);
        return NextResponse.json({ error: "Failed to create job." }, { status: 500 });
    }
}
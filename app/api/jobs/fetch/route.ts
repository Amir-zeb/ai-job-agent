// app/api/jobs/fetch/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import DOMPurify from "isomorphic-dompurify";
import { calculateScore, isInterestJob } from "@/lib/ruleBasedAnalysis/score";

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const queryParams = new URLSearchParams();

        searchParams.forEach((value, key) => {
            if (value && value.trim() !== "") {
                queryParams.append(key, value);
            }
        });

        const remoteOkUrl = `https://remoteok.com/api${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

        const res = await fetch(remoteOkUrl, {
            method: "GET",
            headers: {
                // A unique, non-generic user agent string is mandatory
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MyJobBoardApp/1.0",
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`RemoteOK request failed with status ${res.status}`);
        }

        const data = await res.json();

        // First element is metadata, skip it
        const jobs = Array.isArray(data) ? data.slice(1) : [];

        for (const job of jobs) {
            const description = DOMPurify.sanitize(job.description);
            // deterministic score
            const ruleBasedScore = calculateScore(description);

            await Job.updateOne(
                { url: job.url, aiRated: false },
                {
                    title: job.position,
                    company: job.company,
                    location: job.location,
                    salary: job.salary,
                    salaryMin: job.salary_min,
                    salaryMax: job.salary_max,
                    url: job.url,
                    postDate: new Date(job.date),
                    description,
                    ruleBasedScore,
                    isRelevant: isInterestJob(ruleBasedScore),
                    source: "RemoteOK",
                },
                { upsert: true }
            );
        }

        return NextResponse.json({
            message: "Jobs fetched successfully",
            data: jobs,
            appliedFilters: Object.fromEntries(searchParams.entries()),
        });
    } catch (error) {
        console.log("Error fetching jobs:", error);
        return NextResponse.json({ error, message: "Something went wrong" }, { status: 500 });
    }

}
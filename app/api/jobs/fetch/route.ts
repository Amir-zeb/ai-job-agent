import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import DOMPurify from "isomorphic-dompurify";

export async function GET() {
    try {
        await connectDB();

        const res = await fetch("https://remoteok.com/api");
        const data = await res.json();

        // First element is metadata, skip it
        const jobs = data.slice(1);

        for (const job of jobs) {
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
                    description: DOMPurify.sanitize(job.description),
                    source: "RemoteOK",
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ message: "Jobs fetched successfully", data: jobs });
    } catch (error) {
        return NextResponse.json({ error, message: "Something went wrong" }, { status: 500 });
    }

}
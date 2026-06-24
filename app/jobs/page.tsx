import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { JobT } from "@/lib/types";

import JobList from "./_components/jobList";
import Link from "next/link";

export default async function JobsPage() {
    await connectDB();
    const jobs = await Job.find()
        .sort({
            aiRated: -1,
            aiScore: -1,
            isRelevant: -1,
            ruleBasedScore: -1,
            postDate: -1,
        })
        .lean();

    // Convert ObjectId to string
    const formattedJobs: JobT[] = jobs.map((job: any) => ({
        ...job,
        _id: job._id.toString(),
    }));

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Link href="/">
                <h1 className="text-2xl border-b p-2 bg-white">Dashboard</h1>
            </Link>
            <JobList jobs={formattedJobs} />
        </div>
    );
}
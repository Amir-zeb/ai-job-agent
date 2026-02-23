import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { JobT } from "@/lib/types";

import JobList from "./_components/jobList";

export default async function JobsPage() {
    await connectDB();
    const jobs = await Job.find()
        .sort({ aiScore: -1, aiRated: -1 })
        .lean();

    // Convert ObjectId to string
    const formattedJobs: JobT[] = jobs.map((job: any) => ({
        ...job,
        _id: job._id.toString(),
    }));

    return (
        <div className="min-h-screen relative">
            <h1 className="text-4xl border-b p-2 bg-white">Job Listing</h1>
            <JobList jobs={formattedJobs} />
        </div>
    );
}
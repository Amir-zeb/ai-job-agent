import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { JobT } from "./types";
import JobList from "./_components/jobList";

export default async function JobsPage() {
    await connectDB();
    const jobs = await Job.find()
        .sort({ aiScore: -1 })
        .lean();

    // Convert ObjectId to string
    const formattedJobs: JobT[] = jobs.map((job: any) => ({
        ...job,
        _id: job._id.toString(),
    }));

    return (
        <div className="min-h-screen relative">
            <h1 className="text-4xl border-b-2 p-2 sticky top-0 bg-white">Job Listings</h1>
            <JobList jobs={formattedJobs} />
        </div>
    );
}
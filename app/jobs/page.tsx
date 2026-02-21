import { connectDB } from "@/lib/db";
import Job from "@/lib/models/Job";
import { JobT } from "./types";
import JobCard from "./jobCard";
// import DOMPurify from "isomorphic-dompurify";

export default async function JobsPage() {
    await connectDB();
    const jobs = await Job.find()
        .sort({ createdAt: -1 })
        .lean();

    // Convert ObjectId to string
    const formattedJobs: JobT[] = jobs.map((job: any) => ({
        ...job,
        _id: job._id.toString(),
        // description: DOMPurify.sanitize(job.description || ""),
    }));


    return (
        <div className="min-h-screen relative">
            <h1 className="text-4xl border-b-2 p-2 sticky top-0 bg-black">Job Listings</h1>

            <div className="flex flex-col gap-2 p-2 bg-neutral-900">
                {formattedJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
}
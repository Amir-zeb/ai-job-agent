"use client"

import { useState } from "react";
import JobCard from "./jobCard";
import JobDetails from "./jobDetails";
import { JobT } from "@/lib/types";

type Props = {
    jobs: JobT[];
};

const JobList = ({ jobs }: Props) => {
    const [selectedJob, setSelectedJob] = useState<JobT | null>(null);

    return (
        <div className="flex flex-row gap-2 p-2">
            <div className="flex flex-col flex-1 gap-2">
                {jobs && jobs.map((job) => (
                    <JobCard job={job} key={job._id} setSelectedJob={() => setSelectedJob(job)} />
                ))}
            </div>
            {selectedJob && <JobDetails jobDetails={selectedJob} />}
        </div>
    );
}

export default JobList;
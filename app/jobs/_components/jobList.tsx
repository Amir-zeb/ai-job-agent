"use client"

import { useState } from "react";
import JobCard from "./jobCard";
import JobDetails from "./jobDetails";
import { JobT } from "@/lib/types";

type Props = {
    jobs: JobT[];
};

type SelectedJobT = JobT | null

const JobList = ({ jobs }: Props) => {
    const [jobId, setJobId] = useState<string | null>(null);
    const _selectedJob: SelectedJobT = jobId ? jobs.find(x => x._id === jobId) ?? null : null;

    return (
        <div className="flex flex-row gap-2 p-2">
            <div className="flex flex-col flex-1 gap-2">
                {jobs && jobs.map((job) => (
                    <JobCard job={job} key={job._id} selectedJobId={jobId} setSelectedJob={() => setJobId(job._id)} />
                ))}
            </div>
            {_selectedJob && <JobDetails jobDetails={_selectedJob} />}
        </div>
    );
}

export default JobList;
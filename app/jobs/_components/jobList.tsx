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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchJob = async () => {
        setIsLoading(true)
        await fetch('http://172.26.32.1:3000/api/jobs/fetch').then(res => {
            if (res.ok) window.location.reload();
        }).catch(err => {
            alert('unexpected error occurred.')
            setIsLoading(false)
        })
    }

    if (!jobs.length) {
        return (
            <div className="py-10 px-2 flex flex-col items-center justify-center">
                <p className="text-center text-white">No Records Found.</p>
                <button type="button" className="bg-white px-2 py-1 rounded-sm mt-2 cursor-pointer" disabled={isLoading} onClick={fetchJob}>{isLoading ? 'Fetching jobs' : 'Fetch Jobs'}</button>
            </div>
        )
    }

    return (
        <div className="flex flex-row gap-2 p-2">
            <div className="flex flex-col flex-1 gap-2 p-x-2">
                {jobs && jobs.map((job) => (
                    <JobCard job={job} key={job._id} setSelectedJob={() => setSelectedJob(job)} />
                ))}
            </div>
            {selectedJob && <JobDetails jobDetails={selectedJob} />}
        </div>
    );
}

export default JobList;
'use client'

import { JobT } from "@/lib/types";

type Props = {
    job: JobT;
    setSelectedJob: (job: JobT) => void;
};

const JobCard = ({ job, setSelectedJob }: Props) => {
    return (
        <button className="border-0 bg-transparent text-start cursor-pointer" onClick={() => setSelectedJob(job)}>
            <div className="border p-2 rounded-[5px] bg-white">
                <h3 className="text-2xl">{job.title || '-'}</h3>
                <p>{job.company || '-'}</p>
                <p>{job.location || '-'}</p>
                <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">Score : {job.aiScore}</span>
            </div>
        </button>
    );
};

export default JobCard;
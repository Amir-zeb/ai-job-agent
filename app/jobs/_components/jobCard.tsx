'use client'

import { JobT } from "@/lib/types";

type Props = {
    job: JobT;
    setSelectedJob: (job: JobT) => void;
};

const JobCard = ({ job, setSelectedJob }: Props) => {
    const score = Number(job.aiScore || 0)
    const badgeColor = score > 40 && score < 70 ? 'bg-blue-400 inset-ring-blue-900 text-white' : score > 70 && score <= 100 ? 'bg-blue-400 inset-ring-blue-900 text-white' : 'bg-gray-400/10 text-gray-400 inset-ring-gray-900/20'

    return (
        <button className="border-0 bg-transparent text-start cursor-pointer" onClick={() => setSelectedJob(job)}>
            <div className="border p-2 rounded-[5px] bg-white">
                <h3 className="text-2xl">{job.title || '-'}</h3>
                <p>{job.company || '-'}</p>
                <p>{job.location || '-'}</p>
                <p>AI Reason : {job.aiReason || '-'}</p>
                {job.aiRated ?
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring ${badgeColor}`}>Score : {job.aiScore}</span>
                    :
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring bg-gray-400/10 text-gray-400 inset-ring-gray-900/20">Not Rated</span>
                }
            </div>
        </button>
    );
};

export default JobCard;
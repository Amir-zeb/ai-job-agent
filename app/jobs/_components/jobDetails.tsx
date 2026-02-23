"use client"

import { JobT } from "@/lib/types";

type Props = {
    jobDetails: JobT;
};

const JobDetails = ({ jobDetails }: Props) => {
    return (
        <div className="flex-1 h-screen overflow-y-auto sticky top-0">
            <div className="bg-white p-2">
                <h3 className="text-2xl">{jobDetails.title || '-'}</h3>
                <p>{jobDetails.company || '-'}</p>
                <p>{jobDetails.location || '-'}</p>
                <p dangerouslySetInnerHTML={{ __html: jobDetails.description }} />
                <a href={jobDetails.url} target="_blank" className="border rounded-sm px-2 py-1 hover:bg-gray-200 mt-2 inline-block">View Job</a>
            </div>
        </div>
    );
}

export default JobDetails;
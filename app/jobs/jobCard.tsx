'use client'

import { JobT } from "./types";

type Props = {
    job: JobT;
};

const JobCard = ({ job }: Props) => {

    return (
        <div>
            <h3 className="text-2xl">{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            {/* <p dangerouslySetInnerHTML={{ __html: job.description }} /> */}
            {/* <p>{job.description}</p> */}
            <a href={job.url} target="_blank">View Job</a>
        </div>
    );
};

export default JobCard;
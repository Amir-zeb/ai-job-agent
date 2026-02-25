'use client'

import { JobT } from "@/lib/types";

type Props = {
    job: JobT;
    setSelectedJob: (job: JobT) => void;
};

const JobCard = ({ job, setSelectedJob }: Props) => {
    const score = Number(job.aiScore || 0);

    const getBadgeStyles = () => {
        if (!job.aiRated) {
            return "bg-gray-100 text-gray-500 border-gray-200";
        }

        if (score >= 80) {
            return "bg-green-100 text-green-700 border-green-200";
        }

        if (score >= 50) {
            return "bg-blue-100 text-blue-700 border-blue-200";
        }

        return "bg-red-100 text-red-600 border-red-200";
    };

    return (
        <button
            onClick={() => setSelectedJob(job)}
            className="w-full text-left transition-transform duration-200 hover:-translate-y-1"
        >
            <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">

                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {job.title || "-"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {job.company || "-"}
                        </p>
                        <p className="text-xs text-gray-400">
                            {job.location || "Remote"}
                        </p>
                    </div>

                    {/* Score Badge */}
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeStyles()}`}
                    >
                        {job.aiRated ? `Score: ${score}` : "Not Rated"}
                    </span>
                </div>

                {/* Divider */}
                <div className="my-4 border-t" />

                {/* AI Reason */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                        AI Insight
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                        {job.aiReason || "Job not analyzed yet."}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default JobCard;
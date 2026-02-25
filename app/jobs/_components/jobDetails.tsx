"use client";

import { JobT } from "@/lib/types";

type Props = {
    jobDetails: JobT;
};

const JobDetails = ({ jobDetails }: Props) => {
    const score = Number(jobDetails.aiScore || 0);

    const getBadgeStyles = () => {
        if (!jobDetails.aiRated) {
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
        <div className="flex-1 h-screen overflow-y-auto sticky top-0 bg-gray-50 border-l">
            <div className="max-w-3xl mx-auto p-8">

                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {jobDetails.title || "-"}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {jobDetails.company || "-"}
                            </p>
                            <p className="text-sm text-gray-400">
                                {jobDetails.location || "Remote"}
                            </p>
                        </div>

                        <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeStyles()}`}
                        >
                            {jobDetails.aiRated
                                ? `AI Score: ${score}`
                                : "Not Rated"}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t mb-6" />

                {/* AI Insight */}
                {jobDetails.aiRated && (
                    <div className="mb-6 bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            AI Insight
                        </p>
                        <p className="text-sm text-gray-700">
                            {jobDetails.aiReason || "-"}
                        </p>
                    </div>
                )}

                {/* Job Description */}
                <div className="prose prose-sm max-w-none text-gray-800">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: jobDetails.description || "<p>No description available.</p>",
                        }}
                    />
                </div>

                {/* Apply Button */}
                <div className="text-center mt-10">
                    <a
                        href={jobDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
                    >
                        View Original Job →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
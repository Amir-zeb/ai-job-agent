"use client";
import * as React from 'react';
import { JobT } from "@/lib/types";

type Props = {
    jobDetails: JobT;
};

const JobDetails = ({ jobDetails }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | unknown>(null);
    const score = Number(jobDetails?.analysis?.aiScore || 0);
    const isAnalyzed = jobDetails?.analysis?.isAnalyzed || false;
    const aiReason = jobDetails?.analysis?.reason || 'Job not analyzed yet.';

    React.useEffect(() => {
        console.log(isLoading, error);
    }, [isLoading, error]);

    const getBadgeStyles = () => {
        if (!isAnalyzed) {
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

    const analyzeJob = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch("/api/agent/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobId: jobDetails._id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to analyze job");
            }

            console.log(data);

            // We'll update the UI with the response later
        } catch (error) {
            console.error(error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
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
                            {isAnalyzed
                                ? `AI Score: ${score}`
                                : "Not Rated"}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t mb-6" />

                {/* AI Insight */}
                {isAnalyzed && (
                    <div className="mb-6 bg-white border rounded-lg p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            AI Insight
                        </p>
                        <p className="text-sm text-gray-700">
                            {aiReason}
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
                <div className="text-center mt-10 flex flex-row justify-center gap-1">
                    <button
                        className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
                        onClick={analyzeJob}
                        disabled={isAnalyzed}
                    >
                        Analyze job
                    </button>
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
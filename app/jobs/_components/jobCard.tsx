'use client'

import { Badge } from "@/app/components/badge";
import { JobT } from "@/lib/types";

type Props = {
    job: JobT;
    selectedJobId: string | null;
    setSelectedJob: () => void;
};

const JobCard = ({ job, selectedJobId, setSelectedJob }: Props) => {
    const score = Number(job?.analysis?.aiScore || 0);
    const isAnalyzed = job?.analysis?.isAnalyzed || false
    const aiReason = job?.analysis?.reason || 'Job not analyzed yet.'

    return (
        <button
            onClick={() => setSelectedJob()}
            disabled={selectedJobId === job?._id}
            className="w-full text-left transition-transform duration-200 hover:-translate-y-1"
        >
            <div className="bg-(--primary) relative border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                {selectedJobId === job?._id &&
                    <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 bg-(--secondary) rounded-full" />
                }
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-(--secondary) line-clamp-2">
                            {job.title || "-"}
                        </h3>
                        <p className="text-sm text-(--secondary) mt-1">
                            {job.company || "-"}
                        </p>
                        <p className="text-xs text-(--secondary)">
                            {job.location || "Remote"}
                        </p>
                    </div>

                    <div className="flex flex-row items-end gap-1">
                        {/* Score Badge */}
                        {isAnalyzed ?
                            <>
                                <Badge
                                    label={isAnalyzed ? `Ai Score: ${score}` : "Not Rated"}
                                />
                                <Badge
                                    label={isAnalyzed ? `Recommendation: ${job?.analysis?.recommendation}` : ""}
                                />
                            </> :
                            <>
                                {/* Rule-Based Score Badge */}
                                <Badge
                                    label={job.ruleBasedScore !== undefined ? `Score: ${job.ruleBasedScore}` : "Not Rated"}
                                />
                                <Badge
                                    label={job.isRelevant !== undefined ? `Relevance: ${job.isRelevant ? 'High' : 'Low'}` : "Not Rated"}
                                />
                            </>
                        }
                    </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t" />

                {/* AI Reason */}
                <div className="text-(--secondary)">
                    <p className="text-xs font-medium mb-1">
                        AI Insight
                    </p>
                    <p className="text-sm line-clamp-3">
                        {aiReason}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default JobCard;
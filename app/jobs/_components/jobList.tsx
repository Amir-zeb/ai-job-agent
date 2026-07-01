"use client"

import { useState, useMemo, useEffect } from "react";
import JobCard from "./jobCard";
import JobDetails from "./jobDetails";
import { JobT } from "@/lib/types";

type Props = {
    jobs: JobT[];
};

type SelectedJobT = JobT | null;

const AI_SCORE_FILTERS = [
    { label: "All", min: 0 },
    { label: "60+", min: 60 },
    { label: "75+", min: 75 },
    { label: "90+", min: 90 },
];

const JobList = ({ jobs }: Props) => {
    const [jobId, setJobId] = useState<string | null>(null);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [minScore, setMinScore] = useState(0);

    useEffect(() => {
        setJobId(null); // Reset selected job when filters change
    }, [minScore, selectedSources]);

    const sources = useMemo(
        () => Array.from(new Set(jobs.map((j) => j.source).filter(Boolean))),
        [jobs]
    );

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const passSource = selectedSources.length === 0 || selectedSources.includes(job.source);
            const passScore = (job.analysis?.aiScore ?? 0) >= minScore;
            return passSource && passScore;
        });
    }, [jobs, selectedSources, minScore]);

    const _selectedJob: SelectedJobT = jobId
        ? filteredJobs.find((x) => x._id === jobId) ?? null
        : null;

    const toggleSource = (source: string) => {
        setSelectedSources((prev) =>
            prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
        );
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 px-2 py-3 border-b border-(--primary)">

                {/* Source */}
                {sources.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 shrink-0">Source</span>
                        <div className="flex flex-wrap gap-1.5">
                            {sources.map((source) => {
                                const active = selectedSources.includes(source);
                                return (
                                    <button
                                        key={source}
                                        onClick={() => toggleSource(source)}
                                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border
                                            ${active
                                                ? "bg-(--primary) text-(--secondary) border-(--primary)"
                                                : "bg-transparent text-gray-400 border-gray-700 hover:border-(--primary) hover:text-(--primary)"
                                            }`}
                                    >
                                        {source}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Divider */}
                {sources.length > 0 && (
                    <div className="h-4 w-px bg-gray-700 hidden sm:block" />
                )}

                {/* AI Score */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 shrink-0">AI Score</span>
                    <div className="flex gap-1.5">
                        {AI_SCORE_FILTERS.map(({ label, min }) => (
                            <button
                                key={label}
                                onClick={() => setMinScore(min)}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border
                                    ${minScore === min
                                        ? "bg-(--primary) text-(--secondary) border-(--primary)"
                                        : "bg-transparent text-gray-400 border-gray-700 hover:border-(--primary) hover:text-(--primary)"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear */}
                {(selectedSources.length > 0 || minScore > 0) && (
                    <button
                        onClick={() => { setSelectedSources([]); setMinScore(0); }}
                        className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Count */}
            <p className="text-xs text-gray-500 px-2 pt-2">
                {filteredJobs.length} of {jobs.length} jobs
            </p>

            <div className="flex flex-row gap-2 p-2">
                <div className="flex flex-col flex-1 gap-2">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCard
                                job={job}
                                key={job._id}
                                selectedJobId={jobId}
                                setSelectedJob={() => setJobId(job._id)}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 py-6 text-center">
                            No jobs match the selected filters.
                        </p>
                    )}
                </div>
                {_selectedJob && <JobDetails jobDetails={_selectedJob} />}
            </div>
        </div>
    );
};

export default JobList;
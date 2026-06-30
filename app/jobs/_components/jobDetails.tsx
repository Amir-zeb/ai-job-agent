"use client";
import * as React from 'react';
import dynamic from 'next/dynamic';
import { JobT } from "@/lib/types";
import Accordion from '@/app/components/accordion';
import Toast from '@/app/components/toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/app/components/badge';
import { Document, Page, StyleSheet, Text } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

type Props = {
    jobDetails: JobT;
};

// Disable SSR to prevent Node.js environment errors during build
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#111827',
    },
});

const stripHtmlToPlainText = (html: string) => {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

const CoverLetterDocument = ({ content }: { content?: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Html style={styles.text}>{content?.replace('[Candidate Name]', 'Amir Zeb') || "<p>Cover letter not available.</p>"}</Html>
        </Page>
    </Document>
);

const JobDetails = ({ jobDetails }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [type, setType] = React.useState<'Error' | 'Success' | 'Warning' | null>(null);
    const router = useRouter()

    const analysis = jobDetails?.analysis
    const score = Number(analysis?.aiScore || 0);
    const isAnalyzed = analysis?.isAnalyzed || false;
    const aiReason = analysis?.reason || 'Job not analyzed yet.';
    const strengths = Array.isArray(analysis?.strengths) ? analysis?.strengths.join(', ') : '';
    const missingSkills = analysis?.missingSkills
    const salaryAssessment = analysis?.salaryAssessment;
    const coverLetter = analysis?.coverLetter;

    const analyzeJob = async () => {
        try {
            setIsLoading(true);
            setMessage(null);

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
                throw new Error(data?.message || "Failed to analyze job");
            }
            setType('Success')
            setMessage('Job analyzed successfully')
            router.refresh();
        } catch (error) {
            setType('Error')
            setMessage(error instanceof Error ? error.message : 'Failed to analyze job');
        } finally {
            setIsLoading(false);
        }
    };

    const AiInsight = () => (
        <>
            <div className='mb-2 text-sm text-(--secondary)'>
                <p>{aiReason}</p>
            </div>
            <div className='text-sm mb-2 text-(--secondary)'>
                <p className="font-bold">Strengths:</p>
                <p>{strengths}</p>
            </div>
            <div className='mb-2 text-sm text-(--secondary)'>
                <p className="font-bold">Missing Skills:</p>
                <div>
                    {Array.isArray(missingSkills) && missingSkills.length ? (
                        missingSkills.map(({ skill, priority, reason }, i) => (
                            <React.Fragment key={i}>
                                <p className='mt-2'>
                                    <strong>Skill {(i + 1)}</strong>: {skill}
                                    <br />
                                    <strong>Priority</strong>: {priority}
                                    <br />
                                    <strong>Reason</strong>: {reason}
                                </p>
                            </React.Fragment>
                        ))
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>
            <div className='text-sm mb-2 text-(--secondary)'>
                <p className="font-bold">Salary Assessment:</p>
                <p>{salaryAssessment}</p>
            </div>
            <div className='text-sm mb-2 text-(--secondary)'>
                <p className="font-bold">Cover Letter:</p>
                <div
                    dangerouslySetInnerHTML={{
                        __html: coverLetter || "<p>Cover letter not available.</p>",
                    }}
                />
                <PDFDownloadLink
                    document={<CoverLetterDocument content={coverLetter} />}
                    fileName="cover-letter.pdf"
                >
                    {({ loading }) => (
                        <button
                            disabled={loading || !coverLetter}
                            className="inline-block text-base text-[12px] px-2 py-2 bg-black text-white rounded-lg hover:opacity-90 transition mt-2 mb-2 disabled:opacity-50"
                        >
                            {loading ? 'Preparing document...' : 'Download PDF'}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
            <div className='text-sm mb-2 text-(--secondary)'>
                <p className="font-bold">Email:</p>
                <div>
                    <p><strong>Subject:</strong> {analysis?.email?.subject}</p>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: analysis?.email?.body || "<p>No description available.</p>",
                        }}
                    />
                </div>
            </div>
        </>
    )

    const faqItems = [
        ...(isAnalyzed ? [{ title: 'AI Insight', content: AiInsight() }] : []),
        {
            title: 'Job Ad', content: <>
                {/* Job Description */}
                <div className="prose prose-sm max-w-none text-(--secondary)">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: jobDetails.description || "<p>No description available.</p>",
                        }}
                    />
                </div>

                {/* Apply Button */}
                <div className="text-center mt-10 flex flex-row justify-center gap-1">
                    <a
                        href={jobDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-(--secondary) text-(--primary) rounded-lg hover:scale-110 transition"
                    >
                        View Original Job →
                    </a>
                </div>
            </>
        },
    ];

    return (
        <>
            <div className="flex-1 h-screen overflow-y-auto sticky top-0 bg-(--primary) border-l">
                <div className="max-w-3xl mx-auto p-8">

                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-(--secondary)">
                                    {jobDetails.title || "-"}
                                </h2>
                                <p className="text-(--secondary) mt-1">
                                    {jobDetails.company || "-"}
                                </p>
                                <p className="text-sm text-(--secondary)">
                                    {jobDetails.location || "Remote"}
                                </p>
                                {!isAnalyzed && <button
                                    className="inline-block mt-2 px-6 py-2 text-[14px] mb-4 bg-(--secondary) text-(--primary) rounded-lg hover:scale-110 transition"
                                    onClick={analyzeJob}
                                    disabled={isAnalyzed}
                                >
                                    {isLoading ? "...AI Analyzing Job" : "Analyze Job"}
                                </button>}
                            </div>
                            <Badge
                                label={isAnalyzed
                                    ? `AI Score: ${score}`
                                    : "Not Rated"}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t mb-6" />
                    <Accordion items={faqItems} />
                </div>
            </div>
            <Toast message={message} type={type} />
        </>
    );
};

export default JobDetails;
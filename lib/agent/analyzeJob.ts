import Job from "@/lib/models/Job";
import { analyzeJobWithAI } from "../ai/analyzeJobWithAI";
import { checkUsage, incrementUsage } from "../ai/usage";
import type { JobT, JobAnalysisT } from "@/lib/types";

function normalizeAnalysis(analysis: any): JobAnalysisT {
    return {
        isAnalyzed: true,
        aiScore: Number(analysis?.aiScore ?? 0),
        recommendation: analysis?.recommendation ?? "CONSIDER",
        reason: analysis?.reason ?? "",
        strengths: Array.isArray(analysis?.strengths)
            ? analysis.strengths : [],
        missingSkills: Array.isArray(analysis?.missingSkills)
            ? analysis?.missingSkills : [],
        salaryAssessment: typeof analysis?.salaryAssessment === "string" ? analysis.salaryAssessment : "",
        coverLetter: typeof analysis?.coverLetter === "string"
            ? analysis.coverLetter : "",
        email: {
            subject: typeof analysis?.email?.subject === "string" ? analysis.email.subject : "",
            body: typeof analysis?.email?.body === "string"
                ? analysis.email.body : "",
        },
        analyzedAt: new Date(),
    };
}

export async function analyzeJob(jobId: string): Promise<{ cached: false; analysis: JobAnalysisT } | { message: string; data: JobAnalysisT }> {
    if (!jobId) {
        throw new Error("Job ID is required");
    }

    const { limitReached } = await checkUsage();

    if (limitReached) {
        throw new Error("Daily AI limit reached");
    }

    const job = await Job.findById(jobId);

    if (!job) {
    }

    if (job.analysis?.isAnalyzed) {
        return {
            message: "Already analyzed",
            data: job.analysis,
        };
    }

    // Analyze with AI
    const analysis = await analyzeJobWithAI(job);
    console.log("🚀 ~ analyzeJob ~ analysis:", analysis)
    // const analysis = data.analysis;

    await incrementUsage();

    // Save analysis
    job.analysis = normalizeAnalysis(analysis);

    await job.save();

    return {
        cached: false,
        analysis: job.analysis,
    };
}

// mock data to save ai calls
// const data = {
//     analysis: {
//         isAnalyzed: true,
//         aiScore: 92,
//         recommendation: 'APPLY',
//         reason: "The candidate's 5 years of MERN stack experience, strong proficiency in TypeScript, Node.js, React, Next.js, and relational databases align perfectly with the Senior Software Engineer role. Their experience in API design and payment integration is highly relevant to Finalis's fintech focus. The 100% remote work also matches their preference.",
//         strengths: [
//             '5 years of MERN stack expertise, including TypeScript, Node.js, React, Next.js.',
//             'Proven ability in designing scalable REST APIs and backend services.',
//             'Experience with relational databases (PostgreSQL, MySQL) and data modeling.',
//             'Proficiency in building responsive UIs and full-stack applications.',
//             'Strong problem-solving and debugging skills for production environments.'
//         ],
//         missingSkill: [
//             {
//                 skill: 'python',
//                 reason: 'lorem ipsum',
//                 priority: 'Low'
//             }
//         ],
//         salaryAssessment: `The job offers a "Competitive USD salary" and is 100% remote. Given the candidate's 5 years of relevant experience and strong MERN stack skills, they are well-positioned to negotiate a competitive compensation package.`,
//         coverLetter: "<p>Dear Hiring Team at Finalis,</p><p>I am writing to express my enthusiastic interest in the Senior Software Engineer position, as advertised. With 5 years of experience as a Full Stack MERN Developer, I possess a robust skill set in TypeScript, Node.js, React.js, and Next.js, which aligns perfectly with your minimum requirements and the technical demands of building core infrastructure for private capital markets. My background includes designing scalable REST APIs, integrating payment solutions, and working with relational databases like PostgreSQL and MySQL, all of which are directly applicable to your compliance, data, and payments pillars.</p><p>I thrive in fast-paced environments and am adept at translating complex business needs into elegant, high-impact technical solutions. My strengths lie in building scalable full-stack applications, ensuring code quality, and debugging production issues, which I believe would make me a valuable contributor to your team. The opportunity to work on an AI-native platform and contribute to architectural discussions is particularly exciting.</p><p>I am eager to leverage my expertise to contribute to Finalis's mission and growth. My preference for remote work also aligns seamlessly with your offering. Thank you for considering my application. I have read the job post completely and understand the importance of attention to detail, hence the word POIGNANT. I look forward to the possibility of discussing how my skills and experience can benefit Finalis.</p><p>Sincerely,</p><p>[Your Name]</p>",
//         email: {
//             subject: 'Application for Senior Software Engineer - [Your Name]',
//             body: "<p>Dear Hiring Team,</p><p>I am writing to express my strong interest in the Senior Software Engineer role at Finalis. With 5 years of experience as a Full Stack MERN Developer, I bring expertise in TypeScript, Node.js, React, Next.js, and relational databases, directly matching your requirements. My background in scalable API design and payment integration is highly relevant to your platform's core pillars.</p><p>I am particularly drawn to the opportunity to build AI-native solutions for private capital markets in a 100% remote setting. I am confident my skills will significantly contribute to your team. I have read the job post completely and am tagging RMzkuMzkuMTYuMjc=.</p><p>Thank you for your time and consideration.</p><p>Sincerely,</p><p>[Your Name]</p>"
//         },
//         analyzedAt: new Date()
//     },
// }
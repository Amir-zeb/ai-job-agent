import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: String,
    salaryMin: String,
    salaryMax: String,
    url: String,
    postDate: Date,
    description: String,
    source: String,
    ruleBasedScore: { type: Number, default: 0 },
    isRelevant: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    analysis: {
        isAnalyzed: { type: Boolean, default: false },
        aiScore: { type: Number, default: 0 },
        recommendation: { type: String, default: "" },
        reason: { type: String, default: "" },
        strengths: { type: [String], default: [] },
        missingSkills: {
            type: [{
                skill: { type: String, required: true },
                priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
                reason: { type: String, required: true },
            }],
            default: [],
        },
        salaryAssessment: { type: String, default: "" },
        coverLetter: { type: String, default: "" },
        email: {
            subject: { type: String, default: "" },
            body: { type: String, default: "" },
        },
        analyzedAt: Date,
    }
});

export default mongoose.models.Job ||
    mongoose.model("Job", JobSchema);
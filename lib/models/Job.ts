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
    aiScore: { type: Number, default: 0 },
    isRelevant: { type: Boolean, default: false },
    aiReason: { type: String, default: "" },
    aiRated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job ||
    mongoose.model("Job", JobSchema);
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: String,
    salary_min: String,
    salary_max: String,
    url: String,
    post_date: Date,
    description: String,
    source: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job ||
    mongoose.model("Job", JobSchema);
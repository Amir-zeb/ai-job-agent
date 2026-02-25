import mongoose from "mongoose";

const AiUsageSchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 },
});

export default mongoose.models.AiUsage ||
    mongoose.model("AiUsage", AiUsageSchema);
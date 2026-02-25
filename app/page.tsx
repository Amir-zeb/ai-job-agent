import { connectDB } from "@/lib/db";
import AiUsage from "@/lib/models/AiUsage";
import Job from "@/lib/models/Job";
import Link from "next/link";

export default async function Home() {
  await connectDB();

  // Get latest AI usage record
  const aiUsage = await AiUsage.findOne()
    .sort({ _id: -1 })
    .lean();

  const totalAiUsage: number = aiUsage?.count || 0;

  // Job statistics
  const totalJobs: number = await Job.countDocuments();
  const totalRatedJobs: number = await Job.countDocuments({ aiRated: true });
  const totalUnratedJobs: number = await Job.countDocuments({ aiRated: false });
  const totalBestMatchJobs: number = await Job.countDocuments({
    aiRated: true,
    aiScore: { $gte: 80 },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Job Rating Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard title="Total AI Requests Today" value={totalAiUsage} />
          <StatCard title="Total Jobs" value={totalJobs} />
          <StatCard title="Total Rated Jobs" value={totalRatedJobs} />
          <StatCard title="Total Unrated Jobs" value={totalUnratedJobs} />
          <StatCard title="Best Match Jobs (≥ 80)" value={totalBestMatchJobs} />
        </div>

        {/* Navigation */}
        <div className="text-center mt-10">
          <Link
            href="/jobs"
            className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
          >
            View Jobs →
          </Link>
        </div>
      </div>
    </main>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center border">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
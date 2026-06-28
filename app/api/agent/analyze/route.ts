import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { analyzeJob } from "@/lib/agent/analyzeJob";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { jobId } = await request.json();

        const result = await analyzeJob(jobId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            { status: 500 }
        );
    }
}
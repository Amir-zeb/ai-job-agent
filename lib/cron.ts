import cron from "node-cron";

const domain = process.env.DOMAIN

export function startCron() {
    console.log("Cron started...");

    // Every 15 minutes
    cron.schedule("*/15 * * * *", async () => {
        console.log("Running job fetch cron...");
        try {
            await fetch(`${domain}/api/jobs/fetch`);
            console.log("Jobs fetched successfully");
        } catch (error) {
            console.error("Cron failed:", error);
        }
    });

    // Run Every 5 seconds to rate job. its a free tier so one job at a time
    cron.schedule("*/5 * * * * *", async () => {
        console.log("rating job...");
        try {
            const res = await fetch(`${domain}/api/jobs/rate/fetch`);
            if (res.status === 429) {
                console.log("Daily limit reached. Skipping...");
                return;
            }
            console.log("job rated successfully");
        } catch (error) {
            console.error("Cron failed for job rating:", error);
        }
    });
}
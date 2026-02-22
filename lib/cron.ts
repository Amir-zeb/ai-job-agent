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

    // Run Every minute to rate job. its a free tier so one job at a time
    cron.schedule("* * * * *", async () => {
        console.log("rating job...");
        try {
            // await fetch(`${domain}/api/jobs/rate`);
            console.log("job rated successfully");
        } catch (error) {
            console.error("Cron failed for job rating:", error);
        }
    });
}
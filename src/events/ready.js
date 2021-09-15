module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const { CronJob } = require("cron");
        const job = new CronJob(
            "0 0 */2 * * *",
            () => {
                client.channels.cache
                    .get("870330763772563482")
                    .send(`<@&${client.config.roles.bumper}> Time to bump`);
            },
            null,
            true,
            "America/Los_Angeles"
        );
        job.start();

        const presences = [
            {
                name: `devs who use ${client.config.prefix}helpme <text>`,
                type: "WATCHING",
            },
        ];
        client.user.setPresence({
            activities: [
                presences[Math.floor(Math.random() * presences.length)],
            ],
        });
        console.log(
            `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
        );
    },
};

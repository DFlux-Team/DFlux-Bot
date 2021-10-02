module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        setTimeout(() => {
            client.channels.cache
                .get(client.config.channels.reminder)
                .send(`<@&${client.config.roles.bumper}> Time to bump`);
        }, 2 * 60 * 60 * 1000);

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

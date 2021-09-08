module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
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

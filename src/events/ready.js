const presence = (client) => {
    const presences = [
        {
            name: `devs who use ${client.config.prefix}helpme <text>`,
            type: "WATCHING",
        },
        {
            name: `bored? Play some quiz with ${client.config.prefix}quiz`,
            type: "PLAYING",
        },
    ];
    client.user.setPresence({
        activities: [presences[Math.floor(Math.random() * presences.length)]],
    });
};
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.channels.fetch(client.config.channels.reminder);
        client.util.setReminderTimeout();
        presence(client);
        setInterval(() => presence(client), 1 * 60 * 1000);
        console.log(
            `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
        );
    },
};

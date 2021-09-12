module.exports = {
    name: "helpme",
    execute: async ({ message, client, args }) => {
        if (message.channel?.parent?.id !== client.config.channels.help) {
            if (client.debug)
                console.log(
                    "helpme command not used in a help channel so ignoring"
                );
            return;
        }
        message.guild.members.cache.forEach(async (m) => {
            await m.roles.fetch();
        });
        let lang = null;
        Object.keys(client.config.channels).forEach((cname) => {
            const cid = client.config.channels[cname];
            if (message.channel.id === cid) lang = cname;
        });
        const members = message.guild.members.cache.filter(
            (m) =>
                m.roles.cache.has(client.config.roles.helper) &&
                m.roles.cache.has(client.config.roles[lang]) &&
                m.user.id !== message.author.id
        );
        if (client.debug) {
            console.log(`Language: ${lang}`);
            console.log(`Role ID: ${client.config.roles[lang]}`);
            console.log(`Got ${members.size} members`);
        }
        let member = members.random(1)[0];
        message.channel.send(`${member}, could you help ${message.author}?`);
        const filter = (m) => m.author.id === member.user.id;
        let messages = await message.channel.awaitMessages({
            filter,
            time: 5 * 60 * 1000,
            max: 1,
            errors: ["time"],
        });
        const reRoll = async () => {
            member = members.random(1)[0];
            message.channel.send(
                `${member}, could you help ${message.author}?`
            );
        };
        while (messages.size < 0) {
            await reRoll();
            messages = await message.channel.awaitMessages({
                filter,
                time: 5 * 60 * 1000,
                max: 1,
                errors: ["time"],
            });
        }
        message.delete();
    },
};

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
        await message.guild.members.fetch();
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
            console.log(`Got ${members.size} members`);
        }
        if (members.size === 0) return message.reply(`Sorry, I could not find any guy to help you.`);
        let member = members.random();
        message.channel.send(`${member}, could you help ${message.author}?`);
        const filter = (m) => m.author.id === member.user.id;
        let messages = await message.channel.awaitMessages({
            filter,
            time: 5 * 60 * 1000,
            max: 1,
            errors: ["time"],
        });
        const reRoll = async () => {
            member = members.random();
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

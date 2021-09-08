module.exports = {
    name: "helpme",
    execute: async ({ message, client, args }) => {
        if (message.channel?.parent?.id === client.config.channels.help) {
            let lang = null;
            Object.keys(client.config.channels).forEach((cname) => {
                const cid = client.config.channels[cname];
                if (message.channel.id === cid) lang = cname;
            });
            const members = message.guild.members.cache.filter(
                (m) =>
                    m.roles.cache.has(client.config.roles.helper) &&
                    m.roles.cache.has(client.config.roles[lang])
            );
            console.log(members);
            const random = () => {
                const arr = [...members.values()];
                return arr[Math.floor(Math.random() * arr.length)];
            }
            let member = random();
            message.channel.send(
                `${member}, could you help ${message.author}?`
            );
            const filter = (m) => m.author.id === member.user.id;
            let messages = await message.channel.awaitMessages({
                filter,
                time: 5 * 60 * 1000,
                max: 1,
                errors: ["time"],
            });
            const reRoll = async () => {
                member = random();
                message.channel.send(
                    `${member}, could you help ${message.author}?`
                );
                if (
                    (await message.channel
                        .awaitMessages({
                            filter,
                            time: 5 * 60 * 1000,
                            max: 1,
                            errors: ["time"],
                        })
                        .then((msgs) => msgs.size)) < 0
                )
                    reRoll();
            };
            if (messages.size < 0) {
                await reRoll();
            }
        }
    },
};

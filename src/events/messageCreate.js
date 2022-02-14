const { PermissionsBitField } = require("discord.js");
module.exports = {
    name: "messageCreate",
    once: false,
    async execute(client, message) {
        //if (client.debug) console.log("messageCreate event");
        if (
            !message.author.bot &&
            message.channel.id !== client.config.selfPromo &&
            message.content &&
            message.content.includes("discord.gg") &&
            !message.member.permissions.has(
                PermissionsBitField.Flags.ManageMessages
            )
        ) {
            await message
                .reply("Please don't advertise servers here")
                .then((msg) => {
                    client.wait(3000).then(() => msg.delete());
                });
            message.delete();
        }
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixes = [escapeRegex(client.config.prefix.toLowerCase())];
        const prefixRegex = new RegExp(
            `^(<@!?${client.user.id}> |${prefixes.join("|")})\\s*`
        );
        let prefix = null;
        try {
            [, prefix] = message.content.toLowerCase().match(prefixRegex);
        } catch (e) {} //eslint-disable-line no-empty
        if (!client.application?.owner) await client.application?.fetch();
        if (prefix && !message.author.bot) {
            const userDB = await client.util.fetchUserData(message.author.id);
            const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command =
                client.commands.get(commandName) ||
                client.commands.find(
                    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
                );
            if (!command) return;
            if (
                command.owner &&
                !client.config.owners.includes(message.author.id)
            )
                return;
            message.channel.sendTyping();
            console.log(
                `Executing ${command.name} command, invoked by ${message.author.tag}`
            );
            command.execute({ message, client, args, userDB });
        } else if (
            message.author.id === "302050872383242240" &&
            message.embeds[0].description.includes("Bump done!")
        ) {
            const mention = message.embeds[0].description.split(" ")[0];
            const user = client.util.userFromMention(mention, client);
            const userDB = await client.util.fetchUserData(user.id);
            userDB.totalBumps = Number(userDB.totalBumps) + 1;
            userDB.bumpsThisWeek = Number(userDB.bumpsThisWeek) + 1;
            await userDB.save();
            client.util.setReminderTimeout();
            message.channel.send("Bump Reminder set!").then((msg) => {
                setTimeout((m) => m.delete(), 5 * 1000, msg);
            });
        }
    },
};

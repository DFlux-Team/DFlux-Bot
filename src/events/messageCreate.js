module.exports = {
    name: "messageCreate",
    once: false,
    async execute(client, message) {
        if (client.debug) console.log("messageCreate event");
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
        if (prefix) {
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
            message.channel.sendTyping();
            console.log(
                `Executing ${command.name} command, invoked by ${message.author.tag}`
            );
            command.execute({ message, client, args });
        }
    },
};

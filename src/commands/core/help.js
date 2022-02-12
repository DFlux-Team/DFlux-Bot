const { Embed } = require("discord.js");

module.exports = {
    name: "help",
    description: "List of all commands",
    execute: async ({ message }) => {
        const embed = new Embed()
            .setTitle(`${message.client.user.tag}`)
            .setURL("https://github.com/DFlux-Team/DFlux-Bot")
            .setThumbnail(message.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` });
        message.client.commands.each((cmd) => {
            if (cmd?.owner) return;
            embed.addField({
                name: `${cmd.name}`,
                value: `${cmd.description ?? "No Description"}`,
            });
        });
        message.channel.send({ embeds: [embed] });
    },
};

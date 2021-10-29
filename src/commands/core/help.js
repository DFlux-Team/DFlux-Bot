const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "List of all commands",
    execute: async ({ message }) => {
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${message.client.user.tag}`)
            .setURL("https://github.com/DFlux-Team/DFlux-Bot")
            .setDescription("I Help People On The DevFlux Server")
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`);
        message.client.commands.each((cmd) => {
            if (cmd?.owner) return;
            embed.addField(`${cmd.name}`, `${cmd?.description}`);
        });
        message.channel.send({ embeds: [embed] });
    },
};

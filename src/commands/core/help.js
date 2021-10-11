const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    exceute: async ({ message }) => {
        const helpEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("DFlux BOT")
            .setURL("https://github.com/DFlux-Team/DFlux-Bot")
            .setDescription("I Help People On The DevFlux Server")
            .setThumbnail("https://i.imgur.com/NzuazOI.png")
            .addFields(
                {
                    name: "🏓ping",
                    value: "Returns a Pong message as well as the current stats about the BOT",
                },
                { name: "\u200B", value: "\u200B" },
                {
                    name: "❓quiz",
                    value: "Runs a Quick Quiz to test your potenial",
                },
                { name: "\u200B", value: "\u200B" },
                { name: "🤚help", value: "Provides this Help Message" },
                {
                    name: "🙋helpme",
                    value: "Pings a User who can you help you with the problem your facing",
                }
            )
            .setTimestamp()
            .setFooter(`Requested by ${message.author} `);

        message.channel.send({ embed: [helpEmbed] });
    },
};

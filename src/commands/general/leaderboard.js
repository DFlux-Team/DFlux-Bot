const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "leaderboard",
    aliases: ["bumpboard", "top", "lb"],
    description: "Shows your bump stats or someone elses",
    execute: async ({ message, client }) => {
        const tags = await client.models.User.find({}).then((xyz) => {
            return xyz
                .sort((a, b) => b.totalBumps - a.totalBumps)
                .slice(0, 10)
                .map(({ userId, totalBumps: bumps }) => {
                    return `• ${bumps} Bumps - <@${userId}> (${userId})`;
                });
        });
        const embed = new MessageEmbed()
            .setTitle(`Top 10 - Bump Leaderboard`)
            .setDescription(tags.join("\n"))
            .setColor("BLURPLE");
        message.channel.send({ embeds: [embed] });
    },
};

const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "leaderboard",
    aliases: ["bumpboard", "top", "lb"],
    description: "Shows your bump stats or someone elses",
    execute: async ({ message, client, args }) => {
        const totalOrWeekly =
            args[0] && args[0].toLowerCase() === "weekly"
                ? "bumpsThisWeek"
                : "totalBumps";
        const tags = await client.models.User.find({}).then((xyz) => {
            return xyz
                .sort((a, b) => b[totalOrWeekly] - a[totalOrWeekly])
                .slice(0, 10)
                .map(({ userId, totalBumps, bumpsThisWeek }) => {
                    const bumps =
                        totalOrWeekly === "totalBumps"
                            ? totalBumps
                            : bumpsThisWeek;
                    return `• ${bumps} Bumps - <@${userId}> (${userId})`;
                });
        });
        const embed = new MessageEmbed()
            .setTitle(
                `Top 10 - Bump Leaderboard - ${
                    totalOrWeekly === "totalBumps"
                        ? "Whole Stats"
                        : "This Week Stats"
                }`
            )
            .setDescription(tags.join("\n"))
            .setColor("BLURPLE");
        message.channel.send({ embeds: [embed] });
    },
};

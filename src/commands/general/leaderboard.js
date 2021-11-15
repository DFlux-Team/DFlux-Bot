const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "leaderboard",
    aliases: ["bumpboard", "top"],
    description: "Shows your bump stats or someone elses",
    execute: async ({ message, client }) => {
        const tags = await client.models.User.find({}).then((xyz) => {
            xyz.forEach((a) => client.users.fetch(a).catch(console.log));
            return xyz
                .sort((a, b) => b.totalBumps - a.totalBumps)
                .slice(0, 20)
                .map(({ userId, totalBumps: bumps }) => {
                    const user = client.users.cache.get(userId);
                    return `${bumps} Bumps - ${user?.tag}`;
                });
        });
        const embed = new MessageEmbed()
            .setTitle(`Top 20 - Bump Leaderboard`)
            .setDescription(tags.join("\n"))
            .setColor("BLURPLE");
        message.channel.send({ embeds: [embed] });
    },
};

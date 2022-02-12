const { Embed } = require("discord.js");
module.exports = {
    name: "stats",
    description: "Shows your bump stats or someone elses",
    execute: async ({ message, client, args, userDB: authorUserDB }) => {
        const user = await client.util.userFromMentionOrId(
            args[0] || message.author
        );
        let userDB;
        if (user.id === message.author.id) userDB = authorUserDB;
        else userDB = await client.util.fetchUserData(user.id);
        const embed = new Embed()
            .setTitle(`${user.tag} Bump stats`)
            .addField({
                name: "Total Bumps",
                value: `${userDB.totalBumps}`,
                inline: true,
            })
            .addField({
                name: "Bumps this week",
                value: `${userDB.bumpsThisWeek}`,
                inline: true,
            });
        message.channel.send({ embeds: [embed] });
    },
};

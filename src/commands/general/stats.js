const { MessageEmbed } = require("discord.js");
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
        const embed = new MessageEmbed()
            .setTitle(`${user.tag} Bump stats`)
            .addField("Total Bumps", `${userDB.totalBumps}`, true)
            .addField("Bumps this week", `${userDB.bumpsThisWeek}`, true);
        message.channel.send({ embeds: [embed] });
    },
};

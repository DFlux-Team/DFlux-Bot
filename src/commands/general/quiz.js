const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Collection,
} = require("discord.js");
const axios = require("axios");
const genToken = () => {
    let token = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwzy0123456789.-_";
    for (let i = 0; i < 4; i++) {
        token += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return token;
};
//https://stackoverflow.com/a/15397495
const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};
module.exports = {
    name: "quiz",
    description: "Start a quiz!",
    execute: async ({ message, client, args }) => {
        const { data } = await axios.get(
            "https://quizapi.io/api/v1/questions",
            {
                headers: {
                    "X-Api-Key": process.env.QUIZ_API,
                },
            }
        );
        let question = null;
        if ((args[0] === "--category" || args[0] === "-cat") && args[1])
            question =
                data.find(
                    (q) => q.category.toLowerCase().indexOf(args[1].toLowerCase()) !== -1
                ) ?? null;
        if (!question) question = data[Math.floor(Math.random() * data.length)];
        let correct = question.correct_answers;
        const keys = Object.keys(correct);
        correct = keys.filter((key) => {
            return correct[key] === "true" ? key : null;
        });
        correct = correct[0].replace("_correct", "").replace("answer_", "");
        if (client.debug) console.log(correct);
        const embed = new MessageEmbed()
            .setTitle("Developers Quiz!")
            .setDescription(question.question)
            .addField("Category", `${question.category ?? "undefined"}`)
            .addField(
                "**Options**",
                `• ${Object.values(question.answers)
                    .filter((o) => o)
                    .join("\n• ")}`
            )
            .setColor("RANDOM");
        if (message.guild)
            embed.setAuthor(
                message.guild.name,
                message.guild.iconURL() ??
                    "https://emoji.gg/assets/emoji/discord.png"
            );
        const options = [];
        Object.values(question.answers)
            .filter((o) => o)
            .forEach(() => {
                options.push(new MessageButton());
            });
        const alpha = Array.from(Array(26)).map((e, i) => i + 65);
        const alphabets = alpha.map((x) =>
            String.fromCharCode(x).toLowerCase()
        );
        const codes = new Collection();
        for (let i = 0; i < options.length; i++) {
            const button = options[i];
            const random = genToken();
            const alphabet = alphabets[i];
            const id = `${random}-${alphabet}`;
            codes.set(alphabet, id);
            button
                //.setEmoji(client.data.emojiCharacters[alphabet])
                .setStyle("SUCCESS")
                .setLabel(alphabet.toUpperCase())
                .setCustomId(id);
        }
        const row = new MessageActionRow();
        options.forEach((option) => {
            row.addComponents(option);
        });
        const msg = await message.channel.send({
            embeds: [embed],
            components: [row],
        });
        const ids = [...codes.values()];
        const filter = (i) => ids.includes(i.customId);
        const getByValue = (map, searchValue) => {
            for (const [key, value] of map.entries()) {
                if (value === searchValue) return key;
            }
        };
        const done = {};
        const collector = msg.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
            time: 60 * 60 * 1000, //60 minutes
        });
        collector.on("collect", async (interaction) => {
            //await interaction.deferReply();
            const find = getByValue(codes, interaction.customId);
            if (client.debug) console.log(find, correct, codes);
            const { id, tag } = interaction.user;
            if (!done[id]) done[id] = 0;
            else if (done[id] > 3) interaction.reply(`You can't attemt more than 3 times, ${tag}`);
            done[id]++;
            //if (done[id] && done[id] > 1) interaction.channel.send(`This is the ${done[id]}${nth(done[id])} attempt of **${tag}**`);
            if (find && correct === find) {
                msg.edit({
                    embeds: [
                        embed
                            .setFooter(
                                `${tag} won! (Option ${find}). It's the ${done[id]}${nth(done[id])} attempt of ${tag}`,
                                interaction.user.displayAvatarURL()
                            )
                            .setColor("AQUA"),
                    ],
                    components: [],
                });
                interaction.reply(
                    `Congratulations ${interaction.user}! You selected the correct answer (Option ${find})! :tada:`
                );
                /*interaction.followUp(
                    `Congratulations ${interaction.user}! You selected the correct answer (Option ${find})! :tada:`
                );*/
            } else {
                interaction.reply({
                    content: `Wrong answer, ${tag} (Option ${find})`,
                    ephemeral: true,
                });
                /*interaction.followUp({
                    content: `Wrong answer, ${tag} (Option ${find})`,
                    ephemeral: true,
                });*/
            }
        });
        collector.on("end", async (collected) => {
            msg.edit({ embeds: [embed.setFooter("Timeout!")] });
        });
    },
};

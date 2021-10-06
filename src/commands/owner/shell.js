const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");
const child = require("child_process");
module.exports = {
    name: "shell",
    owner: true,
    execute: async ({ message, client, args }) => {
        const command = args.join(" ");
        const embed = new MessageEmbed().addField(
            "**Input**",
            "```js\n" + command + "\n```"
        );
        const clean = (text) => {
            if (typeof text === "string") {
                if (text.includes(message.client.token)) {
                    //Client token
                    text = text.replace(message.client.token, "T0K3N");
                }
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            } else {
                return text;
            }
        };
        child.exec(command, (err, res) => {
            if (err) {
                if (typeof err !== "string") {
                    err = inspect(err, { depth: 0 });
                }
                return message.reply({
                    embeds: [
                        embed.setDescription(
                            "ERROR:\n```js\n" + clean(err) + "\n```"
                        ),
                    ],
                });
            }
            const type = typeof res;
            if (typeof res !== "string") {
                res = inspect(res, { depth: 0 }); //depth should be 0 as it will give contents of object in a property, in this object. That makes the message too long.
            }

            message.reply({
                embeds: [
                    embed
                        .setDescription("```js\n" + clean(res) + "\n```")
                        .addField("**Type**", type),
                ],
            });
        });
    },
};

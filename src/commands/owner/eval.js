const { Embed } = require("discord.js");
const { inspect } = require("util");
module.exports = {
    name: "eval",
    owner: true,
    execute: async ({ message, client, args }) => {
        const content = args.join(" ");
        const embed = new Embed().addField({
            name: "**Input**",
            value: "```js\n" + content + "\n```",
        });
        const result = new Promise((resolve) => resolve(eval(content)));
        const clean = (text) => {
            if (typeof text === "string") {
                if (text.includes(client.token)) {
                    //Client token
                    text = text.replace(client.token, "T0K3N");
                }
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            } else {
                return text;
            }
        };

        return result
            .then((output) => {
                const type = typeof output;
                if (typeof output !== "string") {
                    output = inspect(output, { depth: 0 }); //depth should be 0 as it will give contents of object in a property, in this object. That makes the message too long.
                }

                message.reply({
                    embeds: [
                        embed
                            .setDescription("```js\n" + clean(output) + "\n```")
                            .addField({ name: "**Type**", value: type }),
                    ],
                });
            })
            .catch((err) => {
                if (typeof err !== "string") {
                    err = inspect(err, { depth: 0 });
                }

                message.reply({
                    embeds: [
                        embed.setDescription(
                            "ERROR:\n```js\n" + clean(err) + "\n```"
                        ),
                    ],
                });
            });
    },
};

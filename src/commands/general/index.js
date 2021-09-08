const commands = require("fs")
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))
    .map((file) => require(`${__dirname}/${file}`));

module.exports = {
    commands,
    metadata: {
        name: "General",
        key: "general",
        emoji: "ℹ️",
    },
};

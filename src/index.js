const { Client, Collection, Intents } = require("discord.js");
require("dotenv").config();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    partials: ["CHANNEL"],
});
const eventsFolder = __dirname + "/events";
const eventFiles = fs
    .readdirSync(eventsFolder)
    .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`${eventsFolder}/${file}`);
    if (event.once) {
        this.once(event.name, (...args) => event.execute(this, ...args));
    } else {
        this.on(event.name, (...args) => event.execute(this, ...args));
    }
}
client.config = require("./config");
["Command"].forEach((f) => {
    console.log(`Loading ${f}s.`);
    require(`./loaders/${f}.js`)(client);
    console.log(`Finished loading ${f}s.`);
});
client.login(process.env.DISCORD_TOKEN);

const { Client, Intents } = require("discord.js");
require("dotenv").config();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        //Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    partials: ["CHANNEL"],
});
client.config = require("./config");
["Command", "Event"].forEach((f) => {
    console.log(`Loading ${f}s.`);
    require(`./loaders/${f}.js`)(client);
    console.log(`Finished loading ${f}s.`);
});
client.login(process.env.DISCORD_TOKEN);

require("dotenv").config();
const { Client, Intents } = require("discord.js");
const util = require("util");
const clock = require("date-events")();
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        //Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    //partials: ["CHANNEL"],
});
process.on("unhandledRejection", (error) => {
    console.log("Unhandled promise rejection");
    console.error(error);
    const channel =
        client.channels.cache.get(client.config?.errorLogsChannelId) ?? null;
    if (channel)
        channel
            .send({
                embeds: [
                    {
                        title: ":x: An error occurred",
                        description: `${error}`,
                        fields: [
                            {
                                name: "Stack trace",
                                value: `${error.stack}`,
                                inline: true,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {});
});
process.on("beforeExit", (/*code*/) => {
    client.destroy();
});
clock.on("weekday", (dayNum) => {
    if (Number(dayNum) !== 7) return;
    client.models.User.updateMany(
        {},
        {
            $set: {
                bumpsThisWeek: 0,
            },
        }
    );
});
client.wait = util.promisify(setTimeout); // await client.wait(1000) - Wait 1 second
client.config = require("./config");
["Command", "Event"].forEach((f) => {
    console.log(`Loading ${f}s.`);
    require(`./loaders/${f}.js`)(client);
    console.log(`Finished loading ${f}s.`);
});
client.debug = process.env.NODE_ENV === "development";
client.data = require("./data");
client.reminderTimeout = null;
client.models = require("./models");
client.util = new (require("./Util"))(client);
// eslint-disable-next-line no-undef
require("mongoose")
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB: ", err);
    });
client.login(process.env.DISCORD_TOKEN);

require("dotenv").config();
const { Client, GatewayIntentBits /*, Partials*/ } = require("discord.js");
const util = require("util");
const clock = require("date-events")();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
    //partials: [Partials.Channels],
});
process.on("unhandledRejection", (error) => {
    console.log("Unhandled promise rejection");
    console.log(error);
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
client.syncBumperOfThisWeek = async () => {
    const weekday = new Date().getDay() + 1;
    if (weekday !== 1) return; //stop running the function if the weekday is not 1 (aka sunday)
    let users = await client.models.User.find({}).lean();
    users = users
        .filter((u) => u.bumpsThisWeek > 0)
        .sort((a, b) => b.bumpsThisWeek - a.bumpsThisWeek);
    let winner;
    try {
        [winner] = users;
        // eslint-disable-next-line no-empty
    } catch (e) {}
    let member;
    try {
        member = await client.guilds.cache
            .get(client.config.dflux)
            .members.fetch(winner.id);
        // eslint-disable-next-line no-empty
    } catch (e) {}
    if (winner) {
        const owner = await client.users.fetch(client.config.owners[0]);
        member.user.send(
            "Hey hey!\nCongratulations, you are the best bumper of this week!"
        );
        owner
            .send(
                `${member} (${member.user.tag} - ${member.user.id}) has won the bumper of this week role.`
            )
            .catch(() => console.log("Can't dm the owner!!"));
        const role = client.config.otherRoles.bumperOfThisWeek;
        const memberWithRole = member.guild.members.cache.find((m) =>
            m.roles.cache.has(role)
        );
        if (memberWithRole) memberWithRole.roles.remove(role);
        member.roles.add(role);
    }
    await client.models.User.updateMany(
        {},
        {
            $set: {
                bumpsThisWeek: 0,
            },
        }
    );
    if (client.bumperTimeout) clearTimeout(client.bumperTimeout);
    client.bumperTimeout = null;
};
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
clock.on("saturday", client.syncBumperOfThisWeek);
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

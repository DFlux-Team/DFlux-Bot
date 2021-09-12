module.exports = {
    name: "restart",
    owner: true,
    execute: async ({ message, client, args }) => {
        let sentMsg;
        message
            .reply("Restarting...")
            .then((msg) => {
                client.destroy();
                sentMsg = msg;
            })
            .then(async () => {
                await client.wait(2000); //Sleep for 2 secs
                client.login(process.env.DISCORD_TOKEN);
                sentMsg.edit("Restarted!");
            });
    },
};

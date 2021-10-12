module.exports = {
    name: "ping",
    description: "Shows the ping of the bot",
    execute: async ({ message }) => {
        const msg = `Pong ${message.author}\nWebsocket heartbeat: ${message.client.ws.ping}ms.\n`;
        message.reply(msg + `Getting roundtrip latency`).then((sent) => {
            sent.edit(
                msg +
                    `Roundtrip latency: ${
                        sent.createdTimestamp - message.createdTimestamp
                    }ms`
            );
        });
    },
};

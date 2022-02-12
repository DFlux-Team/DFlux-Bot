module.exports = {
    name: "bpreminder",
    owner: true,
    execute: async ({ message, args, client }) => {
        let done = false;
        switch (args[0]) {
            case "remove":
            case "rm":
                if (client.bumperTimeout) clearTimeout(client.bumperTimeout);
                client.bumperTimeout = null;
                done = true;
                break;
            case "set":
                client.util.setReminderTimeout();
                done = true;
                break;
        }
        if (done) message.react("✅");
        else message.react("❌");
    },
};

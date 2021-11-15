module.exports = {
    name: "bpreminder",
    owner: true,
    execute: async ({ message, args, client }) => {
        switch (args[0]) {
            case "remove":
            case "rm":
                if (client.bumperTimeout) clearTimeout(client.bumperTimeout);
                client.bumperTimeout = null;
                break;
            case "set":
                client.util.setReminderTimeout();
                break;
        }
        message.react("✅");
    },
};

module.exports = {
    name: "reset",
    owner: true,
    execute: async ({ message, args, client }) => {
        switch (args[0]) {
            case "weekly":
                await client.models.User.updateMany(
                    {},
                    {
                        $set: {
                            bumpsThisWeek: 0,
                        },
                    }
                );
                break;
            case "all":
                await client.models.User.updateMany(
                    {},
                    {
                        $set: {
                            totalBumps: 0,
                            bumpsThisWeek: 0,
                        },
                    }
                );
                break;
        }
        message.react("✅");
    },
};

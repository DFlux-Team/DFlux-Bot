module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        if (!client.application?.owner) await client.application?.fetch();
    },
};

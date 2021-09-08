const AsciiTable = require("ascii-table");
const fs = require("fs");
const { Collection } = require("discord.js");
module.exports = (client) => {
    // Create a new Ascii table
    const table = new AsciiTable();
    table.setHeading("Category", "Status");
    client.commands = new Collection();
    const commandFolder = `${__dirname}/../commands`;
    let commandFolders;
    if (fs.existsSync(commandFolder)) {
        commandFolders = fs.readdirSync(commandFolder);
    } else {
        return console.log(`Can't read ${commandFolder}`);
    }

    for (const folder of commandFolders) {
        let error = false;
        const { commands, metadata } = require(`${commandFolder}/${folder}`);
        for (const cmd of commands) {
            try {
                client.commands.set(cmd.name, cmd);
            } catch (e) {
                console.log(`Error occurred when loading ${cmd.name}`);
                console.error(e);
                error = true;
            }
        }
        if (!error) table.addRow(metadata.name, "✅");
        else table.addRow(metadata.name, "❌");
        if (metadata.name.indexOf("Owner") === -1)
            client.categories.push(metadata);
    }
    console.log(`${table}`);
};

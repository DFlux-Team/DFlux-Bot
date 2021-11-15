const models = require("fs")
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"));

const files = models.map((file) => require(`${__dirname}/${file}`));

const all = {};
for (let i = 0; i < models.length; i++) {
    all[models[i].replace(".js", "")] = files[i];
}
module.exports = all;

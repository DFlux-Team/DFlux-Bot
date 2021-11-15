const { User } = require("discord.js");
module.exports = class Util {
    constructor(client) {
        this.client = client;
    }

    setReminderTimeout() {
        const { client } = this;
        client.reminderTimeout = setTimeout(() => {
            client.channels.cache
                .get(client.config.channels.reminder)
                .send(`<@&${client.config.roles.bumper}> Time to bump`);
        }, 2 * 60 * 60 * 1000);
    }

    async fetchUserData(userId) {
        let userDB;
        try {
            userDB = await this.client.models.User.findOne({
                userId,
            });
            if (!userDB) {
                userDB = new this.client.models.User({ userId });
                await userDB.save();
            }
            // eslint-disable-next-line no-empty
        } catch (e) {}
        return userDB;
    }

    userFromMention(mention, client) {
        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<@!?(\d+)>$/);

        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return null;

        // However, the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        return client.users.cache.get(id);
    }

    async userFromMentionOrId(mentionOrId) {
        if (mentionOrId instanceof User) return mentionOrId;
        let user;
        if (mentionOrId) {
            if (mentionOrId.startsWith("<@")) {
                user = this.userFromMention(mentionOrId, this.client);
            }
            if (!isNaN(parseInt(mentionOrId))) {
                user = await this.client.users.fetch(mentionOrId);
            }
        }
        return user;
    }
};

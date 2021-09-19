const RoleMenu = require('../database/models/rolemenu.js');

module.exports = {
	name: 'messageReactionAdd',
	once: false,
	async execute(reaction, user, client) {
		// When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (user.bot) {
            return;
        }

        const menu = await getMenu(reaction.message.id);

        if (!menu) {
            return;
        }

        const emojiValid = await isEmojiValid(reaction.emoji.name, menu);

        if (!emojiValid) {
            return;
        }

        await reaction.message.guild.members.cache.get(user.id).roles.add(emojiValid);

	},
};

async function getMenu (message_id) {

    const menus = await RoleMenu.findAll({ attributes: ['name', 'message_id', 'roles'] });

    for (let menu of menus) {
        if (message_id === menu['message_id']) {
            return menu
        }
    }

    return null;
}

async function isEmojiValid(emoji, menu) {
    const roles = JSON.parse(menu.roles);

    for (let role of roles) {
        if (emoji === role['emoji']) {
            return role['role'];
        }
    }

    return null;
}
const { MessageEmbed } = require('discord.js');

const helpEmbeds = {
    'Information': new MessageEmbed()
        .setTitle(':notepad_spiral: Bot Information')
        .setDescription(`
            Wowbot is a general purpose bot made for the twitch streamer Woswhi (https://www.twitch.tv/woswhi/)


            **Use the drop down tab below to change menus**

            **Help Pages**
            :hammer: Moderation Help
            :radio_button: Rolemenu Help
            :bell: Notification Help
        `),
    'Moderation': new MessageEmbed()
        .setTitle(':hammer: Moderation Help')
        .setDescription('Here are the list of the Moderation commands')
        .addFields(
            { name: '`ban`', value: 'Ban a member from the server', inline: true  },
            { name: '`unban`', value: 'Unban a member from the server', inline: true },
            { name: '`kick`', value: 'Kick a member from the server', inline: true },
            { name: '`warn`', value: 'Warn a member from the server', inline: true },
            { name: '`purge`', value: 'Clear a certain amount of messages from a channel', inline: true },
            { name: '`view`', value: 'View a members warns', inline: true }
        ),
	'RoleMenu': new MessageEmbed()
        .setTitle(':radio_button: Rolemenu Help')
        .setDescription('Here are the list of the RoleMenu commands... Each one startes with RoleMenu')
        .addFields(
            { name: '`list`', value: 'List all available role menu names', inline: true },
            { name: '`create`', value: 'Create a new role menu', inline: true },
            { name: '`delete`', value: 'Delete a role menu', inline: true },
            { name: '`toggle`', value: "Toggles the menu's visability", inline: true },
            { name: '`update`', value: 'Updates a targetted menu', inline: true },
            { name: '`color`', value: 'Set the embeds color', inline: true },
            { name: '`role`', value: '`Add` / `Remove` a role to the targetted role menu', inline: true },
            { name: '`description`', value: '`Add` / `Remove` a description of the targetted role menu', inline: true },
        ),
    'Notifications': new MessageEmbed()
        .setTitle(':bell: Notification Help')
        .setDescription('Here are the list of Notification commands... Each on will start with `notifications` followed by either `youtube` or `twitch`')
        .addFields(
            { name: '`toggle`', value: 'Enable / Disable the Notification', inline: true },
            { name: '`pingrole`', value: 'Set the role that will be pinged', inline: true },
            { name: '`channel`', value: 'Set the channel that notifications will be sent to', inline: true },
        ),
}

module.exports = { helpEmbeds };
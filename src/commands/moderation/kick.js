const { SlashCommandBuilder } = require('@discordjs/builders');
const { readConfig } = require('../../utils/json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member from the server')
        .addUserOption(option => option.setName("target").setDescription("The user that is getting kicked"))
        .addStringOption(option => option.setName("reason").setDescription("Reason of the kick")),
	async execute(interaction) {

        const data = await readConfig();
        const mod_logging = data.mod_logging;

        if (!interaction.member.roles.cache.has(data.moderation_roles.mod_id) && !interaction.member.roles.cache.has(data.moderation_roles.admin_id)) {
			await interaction.reply('You do not have the permissions to access this command');
			setTimeout(() => {interaction.deleteReply()}, 2000);
			return;
        }
		
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        if (user === null) {
            await interaction.reply('Missing target to kick');

            return;
        }

        interaction.guild.members.kick(user);

        await interaction.reply(`User ${user.username} kicked successfully`);
        setTimeout(() => interaction.deleteReply(), 1000);

        if (!mod_logging.enabled) {
            return;
        }

        const channel = interaction.guild.channels.cache.get(mod_logging.mod_logging_channel_id);

        if (channel) {
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username} has banned ${user.username}`)
                .setFields(
                    { name: 'Ban Reason', value: `${reason}` },
                    { name: 'Banned Id', value: `${user.id}` },
                    { name: 'Time of kick', value: `${Date().toString()}` })
                .setColor('#ff0000');

            await channel.send( {embeds: [embed]} );
        }

	},
};
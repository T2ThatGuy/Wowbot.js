const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

const { helpEmbeds } = require('../../database/roleMenuEmbeds.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends a DM for the command menu'),
	async execute(interaction) {
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('help')
					.setPlaceholder('Please select a category')
					.addOptions([
						{
							label: '📝 Information',
							description: 'Bot information',
							value: 'Information'
						},
						{
							label: '🔨 Moderation',
							description: 'Commands from Moderation category',
							value: 'Moderation',
						},
						{
							label: '🔘 RoleMenu',
							description: 'Commands from RoleMenu category',
							value: 'RoleMenu',
						},
						{
							label: '🔔 Notifications',
							description: 'Commands from Notification category',
							value: 'Notifications',
						},
					]),
			);

		const embed = helpEmbeds.Information.setFooter('Bot by T2ThatGuy | github.com/T2ThatGuy').setColor('#03d8fd');
        
        await interaction.user.send({ embeds: [embed], components: [row] });
        
		await interaction.reply('DM Sent');
        setTimeout(() => interaction.deleteReply(), 2000);
	},
};


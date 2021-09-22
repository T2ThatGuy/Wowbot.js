const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const ModActions = require('../../database/models/moderationActions.js');
const { moderation_roles } = require('../../database/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('view')
		.setDescription('Replies with Pong!')
        .addUserOption(option => option.setName('target').setDescription('Target to check')),
	async execute(interaction) {

        if (!interaction.member.roles.cache.has(moderation_roles.mod_id) && !interaction.member.roles.cache.has(moderation_roles.admin_id)) {
			await interaction.reply('You do not have the permissions to access this command');
			setTimeout(() => {interaction.deleteReply()}, 2000);
			return;
        }

        const target = await interaction.options.getUser('target');

        if (!target) {
            interaction.reply('Missing `target` argument');
            setTimeout(() => {interaction.deleteReply();}, 3000);

            return;
        }
		
        const response = await ModActions.findAll({ attributes: ['reason', 'date', 'modName'], where: { type: 'warn', targetId: target.id } });
        let description = `**Warn History` + ((response.length === 0) ? `**\n\nNo Previous Warns` : ` (${response.length})**\n\n`);  

        for (warn of response) {
            description += `Date: ${warn.date.toDateString()}\nReason: ${warn.reason}\nMod Username: ${warn.modName}\n\n`;
        }

        const embed = new MessageEmbed()
            .setTitle(`${target.username} Information`)
            .setDescription(`${description}`)
            .addFields(
                { name: 'Account Created On', value: `${target.createdAt.toDateString()}`, inline: true},
                { name: 'User ID', value: `${target.id}`, inline: true }
            )
            .setTimestamp()
            .setThumbnail(target.displayAvatarURL())
            .setColor('#ff0000');

        interaction.reply( {embeds: [embed]} );

	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { readConfig } = require('../../utils/json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a member from the server')
        .addUserOption(option => option.setName('user').setDescription('The user to be warned'))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warn')),
	async execute(interaction) {
        
        const data = await readConfig();

        if (!interaction.member.roles.cache.has(data.moderation_roles.mod_id) && !interaction.member.roles.cache.has(data.moderation_roles.admin_id)) {
			await interaction.reply('You do not have the permissions to access this command');
			setTimeout(() => {interaction.deleteReply()}, 2000);
			return;
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (user === null) {
            await interaction.reply('Target user is missing');
            setTimeout(() => interaction.deleteReply(), 1000);

            return;
        }

        const userEmbed = new MessageEmbed()
            .setTitle(`${user.username} has been warned!`)
            .setDescription(`Reason: ${reason}`)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp()
            .setColor('#ff0000');

        await interaction.reply({ embeds: [userEmbed] })

        try {
            await ModActions.create({
                modName: interaction.user.username,
                modId: interaction.user.id,
                targetName: user.username,
                targetId: user.id,
                reason: (reason) ? reason : null,
                type: 'warn',
                date: Date().toString()
            });

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return console.log('That user is already banned');
            }

            return console.log(`Something went wrong whilst warning user ${user.username}`);
        }
        

	},
};
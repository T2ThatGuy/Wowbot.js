const { SlashCommandBuilder } = require('@discordjs/builders');

// DATA IMPORTS //
const { mod_logging } = require('../../database/config.json');
const ModActions = require('../../database/models/moderationActions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the targetted user')
        .addUserOption(option => option.setName("target").setDescription("The user that is getting banned"))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the ban")),
	async execute(interaction) {

        const reason = interaction.options.getString('reason');

        if (interaction.options.getUser('target') === null) {
            await interaction.reply('Add a target to ban');
        }

		const target = interaction.options.getUser('target');
        interaction.guild.members.ban(target);

        try {
            await ModActions.create({
                modName: interaction.user.username,
                modId: interaction.user.id,
                targetName: target.username,
                targetId: target.id,
                reason: (reason) ? reason : null,
                type: 'ban',
                date: Date().toString()
            });

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return console.log('That user is already banned');
            }

            return console.log(`Something went wrong whilst banning user ${target.username}`);
        }
        

        if (!mod_logging.enabled) {
            return;
        }

        const channel = interaction.guild.channels.cache.get(mod_logging.mod_logging_channel_id);

        if (channel) {
            await channel.send(`${interaction.options.getUser('target').username} user banned`);
            return;
        }

        interaction.reply(`User ${target.username} was banned!`);
        setTimeout(() => interaction.deleteReply(), 1000);
        
	},
};
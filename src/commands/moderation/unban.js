const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// DATA IMPORTS //
const ModActions = require('../../database/models/moderationActions');
const { readConfig } = require('../../utils/json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a member from the server')
        .addStringOption(option => option.setName("target").setDescription("The user that is getting unbanned")),
	async execute(interaction) {
        
        const data = await readConfig();
        const mod_logging = data.mod_logging;

        if (!interaction.member.roles.cache.has(data.moderation_roles.mod_id) && !interaction.member.roles.cache.has(data.moderation_roles.admin_id)) {
			await interaction.reply('You do not have the permissions to access this command');
			setTimeout(() => {interaction.deleteReply()}, 2000);
			return;
        }

        let target = interaction.options.getString('target');

        if (target === null) {
            await interaction.reply("Missing target user");
            return;
        }

        const response = await ModActions.findOne({ where: {targetName: target} });
        if (response) {
            target = response.targetId;
            await ModActions.destroy({ where: { id: response.id} });
        } else {
            console.log('Targetted record was not deleted from database');
        }

        try { 
            await interaction.guild.members.unban(target);

        }
        catch (err) {
            // Error if user is not able to be unbanned or wrong id is given
            // console.log(e)
            await interaction.reply('User id not found');
            setTimeout(() => interaction.deleteReply(), 3000);
        
            console.log(err);

            return;
        }

        await interaction.reply(`Unbanned user with id ${target} and name upon ban ${response.targetName}`);
        setTimeout(() => interaction.deleteReply(), 1000);

        if (!mod_logging.enabled) {
            return;
        }

        const channel = interaction.guild.channels.cache.get(mod_logging.mod_logging_channel_id);

        if (channel) {
            const embed = new MessageEmbed()
                .setTitle(`${response.modName} has unbanned ${response.targetName}`)
                .setFields(
                    { name: 'Ban Reason', value: `${response.reason}` },
                    { name: 'Unbanned Id', value: `${response.targetId}` },
                    { name: 'Time of ban', value: `${response.date}` },
                    { name: 'Time of unban', value: `${Date().toString()}` }
                )
                .setColor('#ff0000');

            await channel.send( { embeds: [embed]} );
            return;
        }
	},
};

// TODO Add embed to mod logged response
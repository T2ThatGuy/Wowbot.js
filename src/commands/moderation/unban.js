const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// DATA IMPORTS //
const { mod_logging } = require('../../database/config.json');
const ModActions = require('../../database/models/moderationActions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans the targetted user')
        .addStringOption(option => option.setName("target").setDescription("The user that is getting unbanned")),
	async execute(interaction) {
        
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
                    { name: 'Time of ban', value: `${response.date}` },
                    { name: 'Time of unban', value: `${Date().toString()}` },
                    { name: 'Unbanned Id', value: `${response.targetId}` }
                )
                .setColor('#ff0000');

            await channel.send( { embeds: [embed]} );
            return;
        }
	},
};

// TODO Add embed to mod logged response
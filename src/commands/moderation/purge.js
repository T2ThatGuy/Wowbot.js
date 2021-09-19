const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { mod_logging } = require('../../database/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Clears the specified amount of messages')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount to be cleared'))
        .addChannelOption(option => option.setName('channel').setDescription('Channel to have the messages cleared')),
	async execute(interaction) {
        
        const amount = await interaction.options.getInteger('amount');
        let channel = await interaction.options.getChannel('channel');

        if (amount > 300) {
            await interaction.reply('Amount too high limited to less than 300');

            return;
        }

        if (channel != null) {
            await channel.bulkDelete(amount, true);

            await interaction.reply(`Succefully deleted ${amount} messages from ${channel}`);
            setTimeout(() => interaction.deleteReply(), 1000);

            return;
        }

        channel = interaction.channel;
        await channel.bulkDelete(amount, true);

		await interaction.reply(`Succefully deleted ${amount} messages from ${interaction.channel}`);
        setTimeout(() => interaction.deleteReply(), 1000);

        if (!mod_logging.enabled) {
            return;
        }

        const modChannel = interaction.guild.channels.cache.get(mod_logging.mod_logging_channel_id);

        if (modChannel) {
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username} purged ${amount} from ${channel.name}`)
                .setFields(
                    { name: 'Target Channel', value: `${channel}` },
                    { name: 'Amount Cleared', value: `${amount}` },
                )
                .setColor('#ff0000');

            await modChannel.send( {embeds: [embed]} );
        }
	},
};
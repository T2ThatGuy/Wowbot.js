const { SlashCommandBuilder } = require('@discordjs/builders');

const { writeConfig, readConfig } = require('../../utils/json.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notifications')
		.setDescription('Notification settings')
		.addSubcommandGroup(subcommandgroup =>
            subcommandgroup
            .setName('youtube')
			.setDescription('Youtube notification settings')
			.addSubcommand(subcommand => 
				subcommand
				.setName('toggle')
				.setDescription('Enable / Disable Youtube Notifications'))
			.addSubcommand(subcommand =>
				subcommand
				.setName('pingrole')
				.setDescription('Change the role that will be pinged')
				.addRoleOption(option => option.setName('role').setDescription('Target role to be pinged on notification')))
			.addSubcommand(subcommand =>
				subcommand
				.setName('channel')
				.setDescription('Change the channel that will be pinged')
				.addChannelOption(option => option.setName('channel').setDescription('Target channel to us'))))
		.addSubcommandGroup(subcommandgroup =>
			subcommandgroup
			.setName('twitch')
			.setDescription('Twitch notification settings')
			.addSubcommand(subcommand => 
				subcommand
				.setName('toggle')
				.setDescription('Enable / Disable Twitch Notifications'))
			.addSubcommand(subcommand =>
				subcommand
				.setName('pingrole')
				.setDescription('Change the role that will be pinged')
				.addRoleOption(option => option.setName('role').setDescription('Target role to be pinged on notification')))
			.addSubcommand(subcommand =>
				subcommand
				.setName('channel')
				.setDescription('Change the channel that will be pinged')
				.addChannelOption(option => option.setName('channel').setDescription('Target channel to us')))),
	async execute(interaction) {
		try {
            commandGroup = interaction.options.getSubcommandGroup();
        } catch (e) {
            commandGroup = null;
        }

		switch (commandGroup) {

			case 'youtube':

				switch (interaction.options.getSubcommand()) {

					case 'toggle':
						(async (interaction) => {
							
							let data = await readConfig();
							data.youtube_notif.enabled = !data.youtube_notif.enabled;

							await writeConfig(data);

							interaction.reply(`Youtube notifications have been ${(data.youtube_notif.enabled) ? 'enabled': 'disabled'}`);
							setTimeout(() => interaction.deleteReply(), 2000);

						})(interaction);

					return;

					case 'pingrole':
						(async (interaction) => {

							const role = interaction.options.getRole('role');
							let data = await readConfig();

							if (!role) {
								interaction.reply('Missing role');
								setTimeout(() => interaction.deleteReply(), 2000);

								return;
							}

							data.youtube_notif.notification_role = role.id;

							await writeConfig(data);

							interaction.reply(`Youtube notification role has been set to ${role}`);
							setTimeout(() => interaction.deleteReply(), 2000);

						})(interaction);

					return;

					case 'channel':
						(async (interaction) => {

							const channel = interaction.options.getChannel('channel');
							let data = await readConfig();

							if (!channel) {
								interaction.reply('Missing channel');
								setTimeout(() => interaction.deleteReply(), 2000);

								return;
							}

							data.youtube_notif.notification_channel_id = channel.id;
							await writeConfig(data);
							
							interaction.reply(`Youtube notification channel has been set to ${channel}`);
							setTimeout(() => interaction.deleteReply(), 2000);

						})(interaction);
				}

			case 'twitch':

				switch (interaction.options.getSubcommand()) {

					case 'toggle':
						(async (interaction) => {
							
							let data = await readConfig();
							data.twitch_notif.enabled = !data.twitch_notif.enabled;
	
							await writeConfig(data);
	
							interaction.reply(`Twitch notifications have been ${(data.twitch_notif.enabled) ? 'enabled': 'disabled'}`);
							setTimeout(() => interaction.deleteReply(), 2000);
	
						})(interaction);
	
					return;
	
					case 'pingrole':
						(async (interaction) => {
	
							const role = interaction.options.getRole('role');
							let data = await readConfig();
	
							if (!role) {
								interaction.reply('Missing role');
								setTimeout(() => interaction.deleteReply(), 2000);
	
								return;
							}
	
							data.twitch_notif.notification_role = role.id;
	
							await writeConfig(data);
	
							interaction.reply(`Twitch notification role has been set to ${role}`);
							setTimeout(() => interaction.deleteReply(), 2000);
	
						})(interaction);
	
					return;
	
					case 'channel':
						(async (interaction) => {
	
							const channel = interaction.options.getChannel('channel');
							let data = await readConfig();
	
							if (!channel) {
								interaction.reply('Missing channel');
								setTimeout(() => interaction.deleteReply(), 2000);
	
								return;
							}
	
							data.twitch_notif.notification_channel_id = channel.id;
							await writeConfig(data);
							
							interaction.reply(`Twitch notification channel has been set to ${channel}`);
							setTimeout(() => interaction.deleteReply(), 2000);
	
						})(interaction);
				}

		}

	},
};
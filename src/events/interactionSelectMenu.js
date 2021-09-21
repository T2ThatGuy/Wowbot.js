const { helpEmbeds } = require('../database/roleMenuEmbeds.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isSelectMenu()) return;

        switch ( interaction.customId ) {

            case 'help':

                let embed = helpEmbeds[interaction.values[0]];
                embed.setFooter('Bot by T2ThatGuy | github.com/T2ThatGuy').setColor('#03d8fd');

                await interaction.deferUpdate();
                await interaction.editReply({ embeds: [embed] });

        }
	},
};
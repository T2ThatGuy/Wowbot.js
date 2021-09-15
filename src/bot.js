// DISCORD IMPORTS
const { Client, Intents, Collection } = require('discord.js');
const client = new Client( {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
} );
client.commands = new Collection();

// FILE READING IMPORTS
require('dotenv').config();

module.exports = () => {
    client.login(process.env.DISCORD_TOKEN);
}
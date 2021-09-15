// DISCORD IMPORTS
const { Client, Intents, Collection } = require('discord.js');
const client = new Client( {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
} );
client.commands = new Collection();

// FILE READING IMPORTS
require('dotenv').config();
const fs = require('fs');

const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));

module.exports = (async () => {
    client.handleEvents(eventFiles, "./src/events");
    
    client.login(process.env.DISCORD_TOKEN);
})
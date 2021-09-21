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

const YoutubeNotifications = require('./services/youtube/YoutubeNotifications.js');
const TwitchNotifications = require('./services/twitch/twitchNotifications.js');

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

const sequelize = require('./database/database.js');

module.exports = (async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");

    await sequelize.sync().then((result) => {console.log("Database loaded");}).catch((err) => {console.log(err);});
    
    client.login(process.env.DISCORD_TOKEN);

    client.twitchNotifs = new TwitchNotifications(client);
    client.youtubeNotifs = new YoutubeNotifications(client);

})
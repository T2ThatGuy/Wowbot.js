require('dotenv').config();
const { twitch_notif } = require('../../database/config.json');

const TwitchAPI = require('./twitchAPI.js');

const api = new TwitchAPI();
api.__init();

class TwitchNotifications {
    constructor(client) {
        this._interval = twitch_notif.interval;
        this._discord_channel = twitch_notif.notification_channel_id;
        this._client = client;
        this._timer = setInterval(() => {this.checkLiveLoop(this._client)}, this._interval);

    }

    async checkLiveLoop (client) {

        if (!twitch_notif.enabled) {
            return;
        }

        console.log("[TWITCH] Checking if streamer is live");

        const channel = await client.channels.cache.get(this._discord_channel);
        const details = await api.getUserStream(twitch_notif.channel);

        var messages = await channel.messages.fetch({limit: 100});
        
        if (details['status']) { // If live
            for (let msg of messages){ // Checks if the message has already been sent or not
                if (msg[1].content.includes(`${twitch_notif.channel} is live:`)) {
                    return;
                }
            }
            
            channel.send(`<@&${twitch_notif.notification_role}> \n${details['name']} is live: \n\nhttps://www.twitch.tv/${details['name']}`);

        } else { // No longer live
            for (var msg of messages){
                if (msg[1].content.includes("is live:")) {
                    await msg[1].delete();
                    return;
                }
            }
        }


    }

}

module.exports = TwitchNotifications;
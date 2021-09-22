const { readConfig } = require('../../utils/json.js');
require('dotenv').config();

const TwitchAPI = require('./twitchAPI.js');

const api = new TwitchAPI();
api.__init();

class TwitchNotifications {
    constructor(client) {
        this._client = client;
        this._timer = setInterval(() => {this.checkLiveLoop(this._client)}, 30000);

    }

    async checkLiveLoop (client) {

        let data = await readConfig();
        let twitch_notif = data.twitch_notif;

        if (!twitch_notif.enabled) {
            return;
        }

        console.log("[TWITCH] Checking if streamer is live");

        const channel = await client.channels.cache.get(twitch_notif.notification_channel_id);
        const details = await api.getUserStream(twitch_notif.channel);

        var messages = await channel.messages.fetch({limit: 100});
        
        if (details['status']) { // If live
            for (let msg of messages){ // Checks if the message has already been sent or not
                if (msg[1].content.includes(`${twitch_notif.channel} is live:`)) {
                    return;
                }
            }
            
            channel.send(`${(twitch_notif.notification_role === "" ? '' : `<@&${twitch_notif.notification_role}>` )}\n${details['name']} is live: \n\nhttps://www.twitch.tv/${details['name']}`);

        } else { // No longer live
            for (var msg of messages){
                if (msg[1].content.includes(`${twitch_notif.channel} is live:`)) {
                    await msg[1].delete();
                    return;
                }
            }
        }
    }

}

module.exports = TwitchNotifications;
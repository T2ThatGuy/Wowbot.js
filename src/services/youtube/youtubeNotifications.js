const YoutubeAPI = require('./youtubeAPI.js');
const api = new YoutubeAPI();

const { readConfig, writeConfig } = require('../../utils/json.js');
require('dotenv').config();

class YoutubeNotifications {
    constructor(client) {
        this._client = client;
        this._timer = setInterval(() => {this.checkNewVideos(this._client)}, 30000);

    }

    async checkNewVideos (client) {

        let data = await readConfig();
        let youtube_notif = data.youtube_notif;

        if (!youtube_notif.enabled) {
            return;
        }

        console.log("[YouTube] Checking if streamer has uploaded any new videos");

        const channel = await client.channels.cache.get(youtube_notif.notification_channel_id);
        const details = await api.getUserVideos(youtube_notif.channel_id);

        if (youtube_notif.cached_videos.length === 0) {
            await channel.send(`<@&${youtube_notif.notification_role}>\n\nhttps://www.youtube.com/watch?v=${details[0]}`);

            youtube_notif.cached_videos = details;
            data.youtube_notif = youtube_notif;
            await writeConfig(data);

            return;
        }

        const new_videos = details;
        const old_videos = youtube_notif.cached_videos;

        let newly_uploaded = [];

        for (let i of new_videos) {
            if (!(old_videos.includes(i))) {
                newly_uploaded.push(i);
            }
        }

        if (newly_uploaded.length === 0) {
            return;
        }

        for (let video of newly_uploaded) {
            await channel.send(`<@&${youtube_notif.notification_role}>\n\nhttps://www.youtube.com/watch?v=${video}`);
        }

        youtube_notif.cached_videos = new_videos;
        data.youtube_notif = youtube_notif;

        await writeConfig(data);

    }

}

module.exports = YoutubeNotifications;
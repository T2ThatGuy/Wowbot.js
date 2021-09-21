const YoutubeAPI = require('./youtubeAPI.js');
const api = new YoutubeAPI();

const { youtube_notif } = require('../../database/config.json');
require('dotenv').config();

class YoutubeNotifications {
    constructor(client) {
        this._interval = youtube_notif.interval;
        this._client = client;
        this._timer = setInterval(() => {this.checkNewVideos(this._client)}, this._interval);

    }

    async checkNewVideos (client) {

        if (!youtube_notif.enabled) {
            return;
        }

        console.log("[YouTube] Checking if streamer has uploaded any new videos");

        const channel = await client.channels.cache.get(youtube_notif.notification_channel_id);
        const details = await api.getUserVideos(youtube_notif.channel_id);

        if (youtube_notif.cached_videos.length === 0) {
            let message = (youtube_notif.notificaion_role === "") ? `` : `<@${youtube_notif.notification_role}> `;
            message += `\n\nhttps://www.youtube.com/watch?v=${details[0]}`;

            await channel.send(message);
            youtube_notif.cached_videos = details;

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
            let message = (youtube_notif.notificaion_role === "") ? `<@${youtube_notif.notification_role}> ` : ``;
            message += `\n\nhttps://www.youtube.com/watch?v=${video}`;

            await channel.send(message);
        }

        youtube_notif.cached_videos = new_videos;

    }

}

module.exports = YoutubeNotifications;
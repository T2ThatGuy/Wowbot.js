// API Request Imports
const axios = require('axios');

// File Imports
require('dotenv').config();
const { youtube_notif } = require('../../database/config.json');

// Handles the calls to the Twitch API
class YoutubeAPI {

    buildUserInstance () {
        const instance = axios.create({
            baseURL: 'https://youtube.googleapis.com/youtube/v3/',
        });

        return instance;
    }

    bulidResponseData (responseData) {
        /*
        for video_id in request['items']:
            tempList.append(video_id['contentDetails']['upload']['videoId'])   
        */
        let tempArray = [];

        for (let video of responseData['items']) {
            tempArray.push(video['contentDetails']['upload']['videoId'])
        }

        return tempArray;

    }

    async getUserVideos () {
        const instance = this.buildUserInstance();

        try {
            // activities?part=snippet%2CcontentDetails&channelId=${youtube_notif['channel_id']}&key=${this.apiKey}
            // search?part=snippet&channelId=${youtube_notif['channel_id']}&order=date&key=${this.apiKey}
            const response = await instance.get(`activities?part=snippet%2CcontentDetails&channelId=${youtube_notif['channel_id']}&key=${process.env.youtube_api_key}`);
            return this.bulidResponseData(response.data);

        } catch (error) {

            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);

            } else if (error.response) {
                console.log('No response from server');

            } else {
                console.log('Error', error.message);

            }

            console.log(error.config);

        }
    }
}

module.exports = YoutubeAPI;

// TODO Write cached videos to file
// API Request Imports
const axios = require('axios');

// File Imports
require('dotenv').config();

// Handles the calls to the Twitch API
class TwitchAPI {
    async __init () {
        this.clientID = process.env.TWITCH_API_ID;
        this.clientSecret = process.env.TWITCH_API_SECRET;
        
        this.oauthToken = await this.getOauthToken();
    }

    async getOauthToken () {

        const body = {
            'client_id': this.clientID,
            'client_secret': this.clientSecret,
            'grant_type': 'client_credentials',
        }

        try {
            const response = await axios.post('https://id.twitch.tv/oauth2/token', body);
            return response.data['access_token'];
        } catch (err) {
            console.log(err);
        }

    }

    buildUserInstance () {
        const instance = axios.create({
            baseURL: 'https://api.twitch.tv/helix/',
        });

        instance.defaults.headers.common['Authorization'] = `Bearer ${this.oauthToken}`;
        instance.defaults.headers.common['Client-ID'] = this.clientID;

        return instance;
    }

    bulidResponseData (name, responseData) {
        if (responseData['data'].length > 0) {
            return {'status': true, 'name': name, 'title': responseData['data'][0]['title'], 'game_name': responseData['data'][0]['game_name']};
        }

        return {'status': false}

    }

    async getUserStream (name) {

        const instance = this.buildUserInstance();

        try {

            const response = await instance.get(`streams?user_login=${name}`);
            return this.bulidResponseData(name, response.data);

        } catch (error) {

            if (error.response) {
                console.log(error.response.data);

                if (error.repsonse === 401) {
                    this.oauthToken = this.getOauthToken();

                    const response = await this.getUserStream();
                    return response;

                }

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

module.exports = TwitchAPI;
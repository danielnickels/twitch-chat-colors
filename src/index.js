import { Client as ChatClient } from 'tmi.js';
import hexColorRegex from 'hex-color-regex';
import randomColor from 'randomcolor';
import * as jose from 'jose'

const chatStart = (username, accesstoken, channels) => {

    const chatClient = new ChatClient({
        identity: {
            username: username,
            password: 'oauth:' + accesstoken
        },
        channels: channels
    });

    chatClient.connect();

    chatClient.on('connected', (address, port) => {
        document.getElementById('chatStatus').innerHTML = `Connected to ${address}:${port}.`;
    });

    chatClient.on('message', (channel, tags, message, self) => {

        // Moderator || Broadcaster || Self
        if(tags.mod || '#'+tags.username === channel || username === tags.username)
        {
            if (message.toLocaleLowerCase().indexOf("!ccolor ") == 0)
            {
                let color = message.split(" ")[1];
                console.log(`${channel}: ${tags.username}: ${color}`);

                if (color === "random") {
                    color = randomColor();
                }

                if (hexColorRegex({strict: true}).test(color)) {
                    chatClient.color('', color);
                    document.getElementById('currentColor').style = `color: ${color}`;
                }
            }
        }
    });

    let autoColor;
    document.getElementById('startAuto').addEventListener('click', () => {
        autoColor = window.setInterval(() => {
            let color = randomColor();
            chatClient.color('', color);
            document.getElementById('currentColor').style = `color: ${color}`;
        }, 1000 * document.getElementById("autoInterval").value);
        document.getElementById('autoStatus').innerHTML = "ON";
    });
    document.getElementById('stopAuto').addEventListener('click', () => {
        window.clearInterval(autoColor);
        document.getElementById('autoStatus').innerHTML = "OFF";
    });
}

const run = async () => {
    const oauthHash = new Map();
    location.hash.substring(1).split('&').forEach((value) => {
        oauthHash.set(value.split('=')[0], value.split('=')[1]);
    });

    if(oauthHash.has('access_token') && oauthHash.has('id_token')) {
        const JWKS = jose.createRemoteJWKSet(new URL('https://id.twitch.tv/oauth2/keys'));
    
        const { payload, protectedHeader } = await jose.jwtVerify(oauthHash.get('id_token'), JWKS, {
            issuer: 'https://id.twitch.tv/oauth2',
            audience: config.client_id
        });

        document.getElementById('loginStatus').innerHTML = `You are logged in as ${payload.preferred_username}.`;
        document.getElementById('channels').value = payload.preferred_username;

        document.getElementById('startChat').addEventListener('click', () => {
            chatStart(
                payload.preferred_username, 
                oauthHash.get('access_token'), 
                document.getElementById('channels').value.split(' ')
            );
        });
    }
}

document.getElementById('doLogin').addEventListener('click', () => {
    window.location = `https://id.twitch.tv/oauth2/authorize?response_type=token+id_token&response_mode=query&client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&scope=openid+chat:read+chat:edit`;
});

run();
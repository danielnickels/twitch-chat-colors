# Twitch Chat Colors

### features

- Broadcaster, Moderator and you can change your chat color via ``!ccolor <hexcolor>``
- ``!ccolor random`` randomly sets the color
- Auto-random mode randomly changes your color at intervals of your choice
- Static, client-side app; access token and id token are not visible to the server

### prerequisites

You have to create a Twitch app for the authentication flow and configure the
redirect urls properly. For a local setup, add http://localhost:3000.

### build

- checkout this repository
- run some commands:

```shell
npm install
npx webpack #run this again if you make changes to the javascript
npx serve
```

In `index.html`, provide the client_id for the Twitch app and amend 
redirect_uri as needed.

Open http://localhost:3000

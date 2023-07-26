# Etherpad lite Datagateway-API authentication and authorization

This plugin, based on the sessionId passed by query param, authenticates and authorizes an user. The authorization is based on the permissions to the logbook via datagateway-api


## Plugin installation

In your etherpad-lite dir:

    npm install ep_icat_auth

Add to settings.json:

```
"users": {
    "icatplus": {
        "server": "https://icatplus.server.com"
    },
}
```

Users who are which have access to the logbook of the padName will have access to the pad

## Integration on the client

It is supposed to be used inside an iframe:

```
 <iframe
              title="Report Auth"
              src={`http://etherpad-logbook/auth_session?sessionID=${user.sessionId}&padName=${investigationId}&username=${fullName}`}
              width="100%"
              height={window.innerHeight}
              frameBorder="0"
            ></iframe>
```

# Etherpad 

## Installation

Etherpad can be fully installed by following the next recipe:
```
git clone --branch master https://github.com/ether/etherpad-lite.git &&
cd etherpad-lite &&
npm install --legacy-peer-deps ep_headings2 ep_markdown ep_comments_page ep_align ep_font_color ep_embedded_hyperlinks2 ep_icatplus_auth ep_auth_session &&
./bin/run.sh

```

I did experience problems with the latest version of node. I work around the issue by installing the version 14.18.2 via nvm
```
nvm install 14.18.2
```

## Configuration

Enable requiring authorization and authentication in etherpad settings.json.
```
poetry run python -m datagateway_api.src.main
```
Use this link to get the correct version of node https://learnubuntu.com/update-node-js/?utm_content=cmp-true
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-20-04-1
https://serverfault.com/questions/536576/nginx-how-do-i-forward-an-http-request-to-another-port
https://github.com/ether/etherpad-lite/wiki/How-to-put-Etherpad-Lite-behind-a-reverse-Proxy
https://etherpad.org/doc/v1.3.0/#index_overview
https://louisroyer.github.io/tutorial/2019/09/12/migrate-etherpad-lite-dirtydb-to-postgres-debian-buster.html

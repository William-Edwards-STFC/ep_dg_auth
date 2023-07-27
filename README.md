# Etherpad lite Datagateway-API authentication and authorization

This plugin, based on the sessionId passed by query param, authenticates and authorizes an user. The authorization is based on the permissions to the logbook via datagateway-api


## Plugin installation

In your etherpad-lite dir:

    npm install ep_icat_auth

Add to settings.json:

```
"users": {
    "icat": {
        "server": "https://datagateway.server.com"
    },
}
```

## Integration on the client

It is supposed to be used inside an iframe:

```
              <div>
                <iframe
                  title="Etherpad"
                  src={`${etherpadURL}/auth_session?sessionID=${session}&padName=${padId}`}
                  width="100%"
                  height={window.innerHeight}
                />
              </div>
```

# Etherpad 

## Installation

Etherpad can be fully installed by following the next recipe:
```
git clone --branch master https://github.com/ether/etherpad-lite.git &&
cd etherpad-lite &&
npm install --legacy-peer-deps ep_headings2 ep_markdown ep_comments_page ep_align ep_font_color ep_embedded_hyperlinks2 ep_icat_auth ep_auth_session &&
./bin/run.sh

```

I did experience problems with the latest version of node. I work around the issue by installing the version 14.18.2 via nvm
```
nvm install 14.18.2
```

## Configuration

### Enable requiring authorization and authentication in etherpad settings.json.

### poetry run python -m datagateway_api.src.main

### Use this link to get the correct version of node https://learnubuntu.com/update-node-js/?utm_content=cmp-true

### https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-20-04-1

### https://serverfault.com/questions/536576/nginx-how-do-i-forward-an-http-request-to-another-port

### https://github.com/ether/etherpad-lite/wiki/How-to-put-Etherpad-Lite-behind-a-reverse-Proxy

### https://etherpad.org/doc/v1.3.0/#index_overview

### https://louisroyer.github.io/tutorial/2019/09/12/migrate-etherpad-lite-dirtydb-to-postgres-debian-buster.html

### https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

### use node version 12.22.12 with nvm otherwise it will fail to load lock files. https://www.javatpoint.com/install-nvm-ubuntu

## This is a guide for self signed certificates for developing

Generate private key

```
openssl genpkey -algorithm RSA -out /path/to/private.key
```

Generate CSR (Certificate Signing Request) and Self-Signed Certificate

```
openssl req -new -key /path/to/private.key -out /path/to/certificate.csr

openssl x509 -req -days 365 -in /path/to/certificate.csr -signkey /path/to/private.key -out /path/to/certificate.crt
```

Replace /path/to/private.key, /path/to/certificate.csr, and /path/to/certificate.crt with appropriate file paths.

Configure Nginx:

Edit the Nginx configuration file, which is usually located at /etc/nginx/nginx.conf or in a separate file inside /etc/nginx/conf.d/ or /etc/nginx/sites-available/.

Add the following server block:


```
server {
    listen 443 ssl;
    server_name YOUR_SERVER_IP;  # Replace with your server's IP address

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:9001;  # Replace with the Etherpad's actual listening address and port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Replace YOUR_SERVER_IP with the public IP address of your server, and update the proxy_pass directive with the address and port where Etherpad is running.


Restart Nginx:
```
sudo systemctl restart nginx
```
Save the configuration file and restart Nginx to apply the changes

If you are using ssh through visual studio and have set the port forwarding protocol to https you must disable this before as it will conflict


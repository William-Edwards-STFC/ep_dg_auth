# Etherpad lite Datagateway-API authentication and authorization

This plugin, based on the sessionId passed by query param, authenticates and authorizes an user.

```
When using the docker setup you will need to edit the etherpad url and remove these lines from the dataview settings
RUN mv res plugins/datagateway-dataview
replace this line COPY config/datagateway-dataview-settings.json /usr/local/apache2/htdocs/plugins/datagateway-dataview/
with COPY config/datagateway-dataview-settings.json /usr/local/apache2/htdocs/
```

Expected results for a non-authenticated user
![image](https://github.com/William-Edwards-STFC/ep_dg_auth/assets/71259172/2bf2d2d7-033f-44b0-b3b9-c2f31164ef7d)


## Reccommended setup

After cloning etherpad you need to move the settings from this repository to the etherpad folder in your VM

If the etherpad instance isn't put into the datagateway-dataview settings file as https:// it won't work.

### Installing NVM, NPM and node.
```
We need to do this before etherpad so that we can install plugins.
sudo apt update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
Restart terminal or open a new one
nvm --version       <------ Check that this returns a value before proceeding
nvm install node
nvm install 14
nvm use 14
node --version      <------ Check that this returns a value before proceeding
npm install --global yarn
```

# Etherpad 

## Installation based on Ubunto 20.04 Focal no gui

Etherpad can be fully installed by doing the following:
```
git clone --branch master https://github.com/ether/etherpad-lite.git &&
cd etherpad-lite &&
npm install --legacy-peer-deps ep_dg_auth ep_auth_session &&
./bin/run.sh
```

## Plugin installation

In your etherpad-lite dir:

    npm install ep_dg_auth

Add to settings.json:

```
"users": {
    "dgserver": {
        "server": "http://datagateway.server.com"
    }
Change authentication and authorization settings to true depending on which hooks you will be using.
```

## Integration on the client

It is supposed to be used inside an iframe on the same site to use the Lax cookie otherwise a reverse proxy is required and the cookie must be set to none in etherpad settings:

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

## This is a guide for self signed certificates for developing

Install nginx
```
sudo apt update
sudo apt install nginx
sudo ufw allow 'Nginx HTTP'
```

Generate private key

```
cd ~
mkdir keys
sudo openssl genpkey -algorithm RSA -out keys/private.key
```

Generate CSR (Certificate Signing Request) and Self-Signed Certificate

```
sudo openssl req -new -key /path/to/private.key -out keys/certificate.csr

sudo openssl x509 -req -days 365 -in keys/certificate.csr -signkey keys/private.key -out keys/certificate.crt

Please put your server IP in "Common Name" when asked everything else can be left blank
```

Replace /path/to/private.key, /path/to/certificate.csr, and /path/to/certificate.crt with appropriate file paths.

Move the keys to nginx

```
cd /etc/nginx
sudo mkdir keys
cd ~/keys
sudo mv certificate.crt /etc/nginx/keys
sudo mv private.key /etc/nginx/keys
```

Configure Nginx:

Edit the Nginx configuration file, which is usually located at /etc/nginx/nginx.conf or in a separate file inside /etc/nginx/conf.d/ or /etc/nginx/sites-available/.

```
sudo iptables -A ufw-user-input -p tcp -m tcp --dport 443 -j ACCEPT &&
sudo iptables -A ufw-user-input -p udp -m udp --dport 443 -j ACCEPT &&
sudo iptables -A ufw-user-input -p tcp -m tcp --dport 3000 -j ACCEPT &&
sudo iptables -A ufw-user-input -p udp -m udp --dport 3000 -j ACCEPT &&
sudo iptables -A ufw-user-input -p tcp -m tcp --dport 9001 -j ACCEPT &&
sudo iptables -A ufw-user-input -p udp -m udp --dport 9001 -j ACCEPT
```

Add the following server block:


```
server {
    listen 443 ssl;
    server_name YOUR_SERVER_IP;  # Replace with your server's IP address

    ssl_certificate keys/certificate.crt;
    ssl_certificate_key keys/private.key;

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

### Installing datagateway to a VM

```
git clone https://github.com/ral-facilities/datagateway.git
npm install -g yarn
cd datagateway
yarn install
yarn datagateway-dataview
```

### Configuring datagateway
```
Please head over to datagateway-dataview-settings.json and configure the IDS, API, downloadAPI and etherpad urls.
You can use preprod urls from here https://scigateway-preprod.esc.rl.ac.uk/plugins/datagateway-dataview/datagateway-dataview-settings.json
Please use the IP from your etherpad machine with https:// and without the port if you are using nginx
```

### Installing icat-cloud-native
Follow the instructions here https://github.com/icatproject-contrib/icat-cloud-native-migration you will need the icat db, icat, dg-api, scigateway-auth, auth
To get this to work you will need to populate the database by running docker-compose up --build and then rebuilding the test container after it has run.




### Installing datagateway api to a VM

```
git clone https://github.com/ral-facilities/datagateway-api.git
curl https://pyenv.run | bash
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
sudo apt update
sudo apt install build-essential zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev libssl-dev liblzma-dev libffi-dev findutils
curl -sSL https://install.python-poetry.org | python3 -
export PATH="~/.local/bin:$PATH"
source ~/.bashrc
Restart your terminal
poetry install
poetry run python -m datagateway_api.src.main
```

### Configuring datagateway api

```
Please point this to an ICAT instance
```


### Helpful Links
```
Use this link to get the correct version of node https://learnubuntu.com/update-node-js/?utm_content=cmp-true
Reverse proxy help https://github.com/ether/etherpad-lite/wiki/How-to-put-Etherpad-Lite-behind-a-reverse-Proxy
Etherpad documentation https://etherpad.org/doc/v1.3.0/#index_overview
Installing postgresql on your developer instance https://louisroyer.github.io/tutorial/2019/09/12/migrate-etherpad-lite-dirtydb-to-postgres-debian-buster.html
```
### Troubleshooting
If you are having trouble connecting make sure the ports are open and nginx is running
```
sudo iptables -S | grep [port number]
sudo systemctl status nginx
```

### If you have to use openstacks console instead of SSH the following link will help you run tasks in the background so you can run dg. dg-api and etherpad all on the same VM.


###Plugins
```
ep_­spellcheck
ep_­table_­of_­contents
ep_­image_­upload
ep_­adminpads2
ep_­mammoth - Import word documents could be really useful
ep_­print - Haven't tested enough
```

```
https://www.baeldung.com/linux/detach-process-from-terminal
```

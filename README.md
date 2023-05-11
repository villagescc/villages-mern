# villages

Federated villages built on MERN

## Prerequisite:

- RAM: At least 1 GB
- HDD: At least 8 GB

# Installing App on vps server.
Clone app from git@github.com:villagescc/villages-mern.git on vps
git clone git@github.com:villagescc/villages-mern.git

## Installing MongoDB and Configuring.
You don’t have to install MongoDB.
This App uses Mongo Atlas API.

## Install Node.js.
Setup PM2 to run React in frontend, Node.js in backend.
sudo npm install –g pm2

## Navigate to Backend Directory
cd ~/backend
pm2 start npm –name “backend” start
pm2 startup
pm2 save

## Navigate to Frontend Directory
cd ~/frontend
pm2 start npm –name “frontend” run serve –s build
pm2 startup
pm2 save

## Install Nginx and Configure it.
### Install Nginx
sudo apt install nginx

### Remove default configurations
sudo rm /etc/nginx/sites-available/default
sudo rm /etc/nginx/sites-enabled/default

### Create new Nginx configuration
Paste the following. In this configuration we are pointing the main domain path to the build output directory of React.js application and the /api path for the Express.js application.
sudo nano /etc/nginx/sites-available/villages.io.conf

```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name villages.io;

    # SSL
    ssl_certificate /etc/letsencrypt/live/villages.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/villages.io/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/villages.io/chain.pem;

    # security
    include nginxconfig.io/security.conf;

    # Logging
    access_log /var/log/nginx/access.log combined buffer=512k flush=1m;
    error_log /var/log/nginx/error.log warn;

    # reverse proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        include nginxconfig.io/proxy.conf;
    }

    # additional config
    include nginxconfig.io/general.conf;
}

# subdomains redirect
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name *.villages.io;

    # SSL
    ssl_certificate /etc/letsencrypt/live/villages.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/villages.io/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/villages.io/chain.pem;

    location / {
        return 301 https://villages.io$request_uri;
    }
}

# HTTP redirect
server {
    listen 80;
    listen [::]:80;
    server_name villages.io;

    include nginxconfig.io/letsencrypt.conf;

    location / {
        return 301 https://villages.io$request_uri;
    }
}
```


### Enable your configuration by creating a symbolic link.
Sudo ln –s /etc/nginx/sites-available/villages.io.conf /etc/nginx/sites-enabled/villages.io.conf

### Check your Nginx configuration and restart Nginx
sudo nginx –t
sudo service nginx restart

## How to Restart App
pm2 restart backend
pm2 restart frontend

Here are other pm2 commands for various tasks as well that are pretty self explanatory:
pm2 show app
pm2 status
pm2 restart app
pm2 stop app
pm2 logs (Show log stream)
pm2 flush (Clear logs)

## Setup SSL
Install free Let’s Encrypt SSL certificate for domain.
sudo apt install python3-certbot-nginx

Execute the following command to install certificate and configure redirect to HTTPS automatically
sudo certbot –nginx –redirect –agree-tos –no-eff-email –m info@villages.io –d villages.io –d www.villages.io

Now you should receive SSL certificate and it will be configured automatically.

## Setup auto renewal
sudo certbot renew –dry-run

Now you can look up your domain in your browser to see the output.





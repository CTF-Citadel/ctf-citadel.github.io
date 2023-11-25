---
title: Quick Start
---

Hosting your own CTF can be quite tricky, but we want to change that!

Below you will find all the necessary steps to get your own instance of CTF-Citadel up and running in no time!

## Aquiring the Code ##

We can start off by cloning the main WebApp Repository

```bash
# clone the repo
git clone https://github.com/CTF-Citadel/webapp
# change into the new folder
cd webapp/
```

Great, now we have everything we need to get started!

Although some examples below dont strictly need to build from source, the repo also contains config files for the database and the reverse proxy that handles SSL.

## Deploy Using Docker ##

We made hosting your own instance of CTF-Citadel really easy to accoplish using the power of Docker.

Fresh Images of our WebApp are built on every push to `master` and can be pulled from here:

```bash
docker pull ghcr.io/ctf-citadel/webapp:main
```

An way easier method is to use our `docker-compose.yaml` file already present in the repo.

Keep in mind that this file is setup to build the web container from source, which presents and excellent opportunity in case you want to tweak something in the source code yourself.

Alternatively, you can use a slightly modified version of the developement Compose file.
This pulls the prebuilt image mentioned above directly from our GitHub Container Registry:

```yaml
version: '3'
services:
  proxy:
    image: nginx:latest
    hostname: proxy
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./proxy/conf:/etc/nginx/conf.d
      - ./proxy/ssl:/etc/ssl/private
    environment:
      TZ: Europe/Vienna
    restart: unless-stopped
  mariadb:
    image: mariadb:latest
    hostname: mariadb
    environment:
      MARIADB_DATABASE: 'lucia'
      MARIADB_ROOT_PASSWORD: 'CHANGEME'
      TZ: Europe/Vienna
    volumes:
      - ./data/mariadb:/var/lib/mysql
      - ./db:/docker-entrypoint-initdb.d
    restart: unless-stopped
  astro:
    image: ghcr.io/ctf-citadel/webapp:main
    hostname: astro
    environment:
      EMAIL_SERVICE: 'hotmail'
      EMAIL_NAME: 'someone@example.com'
      EMAIL_PASS: 'CHANGEME'
      DB_HOST: 'mariadb'
      DB_NAME: 'lucia'
      DB_PASS: 'CHANGEME'
      TZ: Europe/Vienna
    restart: unless-stopped
```

### What to change ###

The file might look a bit overwhelming at first so here is a walkthrough on what you will need to change.

### Bind Mounts ###

- `./proxy/conf:/etc/nginx/conf.d`: This is a bind mount to the configuration files for the NGINX reverse proxy. This path should not need changing as long as you do not change the file location of the `docker-compose.yaml`. You can navigate to `proxy/` from the repo root and examine the provided config file. If desired you can use a different proxy or integrate it into an already exisiting one.
- `./proxy/conf:/etc/nginx/conf.d`: This is the bind mount to your SSL Certificates that NGINX will use to secure your traffic over HTTPS. If you examined the config file you might have noticed that it will always look for `server.crt` and `server.key`. You should either name your certfiles accordingly or modify the paths in the config file mentioned above

> **Hint**: Although not advised, you can generate self-signed certificates with this neat one-liner:
> ```bash
> openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout server.key -out server.crt
> ```

- `./data/mariadb:/var/lib/mysql`: This is where your database stores data, which is user data, challenges, ongoing events and more. Choose this path wisely as it is where your data will reside!
- `./db:/docker-entrypoint-initdb.d`: This is the initialization Schema Path for the MariaDB database. This should not need changing if you didn't alter the directory structure. As with the NGINX config, feel free to take a look at the initial schema to see what it does.

### Environment Variables ###

- `EMAIL_NAME`: This is the E-Mail that will be used for Verification and Password Reset E-Mails for Users.
- `EMAIL_PASS`: Password for the E-Mail Account that you specified above.
- `EMAIL_SERVICE`: This is the service specifier that will vary depending on what email provider you use. The default is `hotmail`, which works for Microsoft E-Mails.
- `DB_*`: These are database parameters and should match the ones that you define for the MariaDB container itself. We won't got into more detail on each of them as they are pretty self-explanatory

Once you are happy with your changes, there is only one thing left to do:

**With the original from-source Compose File:**

```bash
docker-compose --profile full up -d --build
```

**With the modified pre-built Compose File:**

```bash
docker-compose up -d
```

This will start (and build) all containers and if you go to `https://localhost:443/`, you should see the Login Page show up.

> **Hint**: Keep in mind that the first user to sign-up on a newly created instance will automatically be assigned the administrator role!

## Deploying Barebones ##

> ***Coming Soon...***

___

Authors: Birnbacher Maximilian
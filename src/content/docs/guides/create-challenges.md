---
title: Creating New Challenges
---

## Create challenges with a GitHub repo

> **NOTE:** <br/>
> CTF-Citadel was designed with the principle of preventing the sharing of flags.

In general, the content of challenges may vary, but the folder structure should adhere to the following guidelines:

```
challenge-xyz/
├── subfolder/
| └── files
├── REAMDE.md
├── writeup.md
├── Dockerfile
├── docker-compose.yml
├── challenge.config
└── other files, ...
```

## Explanations for each file:

**Readme.md** <br/>
This file is for general description of the challenge and is just **optional**, it is not required for challenge deployment. 

___


**Writeup.md** <br/>
This file should be a writeup from the challenge-author himself, this should be released after the event is over. Although this file is **optional**, it is recommended for the best learn experience of the participants.

___


**Dockerfile** <br/>
This file may contain further arguments to setup a certain docker-container. Can be named differently, but keep Dockerfile in the name.

Example:
```DOCKERFILE
FROM php:8-fpm

...

CMD ["/bin/bash", "-c", "/usr/sbin/sshd && php-fpm"]
```

___

**docker-compose.yml** <br/>
This file controls the deployment of the used containers.

Example:
```yml
version: "3"

services:
  db:
    build:
      context: .
      dockerfile: Dockerfile_DB
    hostname: db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PW}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PW}

  flask_app:
    image: python:3.9-slim
    build:
      context: .
      dockerfile: Dockerfile_PY
    hostname: flask-app
    depends_on:
      - db
    environment:
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PW}
      MYSQL_DATABASE: ${DB_NAME}
      FLAG: ${FLAG}

  react_app:
    build:
      context: ./react_app
      dockerfile: Dockerfile_REACT
    ports:
      - "80:80"
```

___

**challenge.conf** <br/>
This file contains all information which is being displayed on the webapp such as `title`, `description`, `hints` in order and `difficulty` which corresponds to the points the challenge gives.

Example:
```conf
[Challenge]
id = 001
title = "Ouch, my brain"
description = "Solve the mysterious cryptic puzzle to uncover the hidden message."

[Hints]
hint1 = "Look for clues in the encoded message."
hint2 = "Understanding common ciphers might be helpful."
hint3 = "Pay attention to patterns and repetitions in the text."
```

Why all this? We want to specify only one repo URL during event creation and challenges will be created automatically. This is a big step towards reusability and usability.

___

Authors: Schager Jannik, Birnbacher Maximilian
---
title: Anti-Cheat
description: Reference for Anti-Cheat
---

An Anti-Cheat-System is always important to have to prevent illegal and negative behavior. In this case we deploy an extra docker container just for the anti-cheat. The docker-container includes a **fastapi** endpoint to receive information, process it and provide the processed data, the container also includes a database which can be changed in the docker-compose.yml but is set to **mariadb** per default which logs overall events fro mthe webapp but also logs specific user events to determine if possible flag sharing is going on between multiple teams. 

___

Authors: Schager Jannik
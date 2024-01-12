---
title: Infra-Backend
description: Documentation for the Infra-Backend
---
The Infra-Middleware is used to control the entire lifecycle of the challenge container instances.

## Challenge fetch
Once the Infra-Middleware container is started, we check for challenges.
This is done by downloading the challenge GitHub repo. The challenges can also be provided as a downloadable ZIP.

After the challenges are downloaded, they can be deployed using the corrosponding REST endpoint.

## Challenge creation
Because most of our challenges use multiple containers for one challenge instance, we use Docker-Compose.
When a user starts a challenge, the webapp backend calls the middleware with Flag and Challange type as a parameter.

In the middleware, each instance gets assigned a UUID. This UUID will be used to identify the instance hereafter.
For every instance, the challenge folder is copied to a folder named after the UUID.
In this folder we will find:
- compose-file
- mount for container files

Once the files are copied, we start the container build process using the parameters given by the webapp backend as environment variables.
After the finished build the middleware returns the UUID, the challenge and the environment variables.
These values are then used by the webapp.

___

Authors: Felix S.
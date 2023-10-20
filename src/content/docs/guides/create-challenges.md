---
title: Creating New Challenges
---

## Create challenges with a GitHub repo

> **NOTE**:
> If there are static flags, please put them as `goldnugget.txt` in the folder for the challenge.

In general, a challenge folder looks like this:

```
challenge-xyz/
├── subfolder/
| └── files
├── REAMDE.md
├── writeup.md
├── Dockerfile
├── docker-compose.yml
├── challenge.config
├── hints
├── goldnugget.txt (only for static flags)
└── other files, ...
```

Here is a short explanation:
- In `README.md` is the explanation which will be visible to the user.
- In `writeup.md` is the writeup which will be available after the event.
- `Dockerfile` is probably clear. This is used to build a container. Can basically be named differently, but please keep Dockerfile in the name.
- With `docker-compose.yml` obviously the deployment is controlled.
- In the `challenge.config` file challenge tags, points, ENV variables, hint costs etc. are defined.
- In `hints` are the hints (the hint content) for the challenge.
- `goldnugget.txt` is only used for statics flags. Should no 
- Subfolders and other files can be used, but the above structure must exist.

Why all this? We want to specify only one repo URL during event creation and challenges will be created automatically. This is a big step towards reusability and usability.
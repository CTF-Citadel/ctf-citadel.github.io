---
title: Anti-Cheat
description: Reference for Anti-Cheat
---

Having an Anti-Cheat System is vital to stop cheating and overall negative behavior. In this case we deploy an additional 2 docker containers just for the anti-cheat. The docker-container includes a **fastapi** endpoint to receive information, process it and provide the processed data, furthermore a **socket** endpoint is being used to fetch data in realtime to a client. **mariaDB** is being leveraged to log flag submissions and initiations.  
![Big Picture](https://winklersblog.net/imgs/anti_cheat_architecture.png)

The image above shows the overall workflow of the **Anti-Cheat**. The container-stack itself can be implemented anywhere but because there is no authentication implemented yet, it is recommended to only use it locally and not expose its ports because this may leak sensitive information.

## Ways to capture **Flag-Sharing**:
- `Same flag-submission` -> Check if a team submitted the same flag as another team or submitted the valid flag of another team. 
- `Same challenge-submissions` -> If the same challenges are submitted in the same order by 2 different teams the teams will be marked as suspicious.
- `Time difference for flag-submissions` -> If the same challenges are submitted by 2 different teams within a certain time (per default 10 minutes) the 2 teams will be marked as suspicious.
- `Poisoned flags` -> An API endpoint is established to receive flags designated as poisonous. These flags are subsequently disseminated among potential flag-sharing participants to detect and address such behavior.

## Implementation
The Anti-Cheat implements **FastAPI** to capture every flag submission and initiation. <br/>
```py
@app.post('/submissions', description='An endpoint to receive flag submissions of users.')
async def submit_flag(flag_submission: dict):
    db = DBSession()
    db_flag_submission = Submission(**flag_submission)
    db.add(db_flag_submission)
    db.commit()
    db.refresh(db_flag_submission)
    db.close()

    same_flag_check(flag_submission.get('team_id'), flag_submission.get('user_id'), flag_submission.get('challenge_id'), flag_submission.get('flag'), flag_submission.get('submission_time'))

    return {"message": "Flag submission created successfully"}

@app.post("/initiate_flag", description='An endpoint to receive the intitiated flags from all teams when challenges are deployed.')
async def initiate_flag(flag_initiation: dict):
    db = DBSession()
    db_flag_initiation = Initiated_Flag(**flag_initiation)
    db.add(db_flag_initiation)
    db.commit()
    db.refresh(db_flag_initiation)
    db.close()
    
    return {"message": "Flag initiation created successfully"}
```
The `submission` API-endpoint will wait for an incoming request containing the information of the flag submission and store it in the database. 
Furthermore it will call the **same_flag_check()** function with the properties of the request which will then check if the user should be flagged. 
The `initiate_flag` API-endpoint will wait for an incoming request containing the information of the flag initiation and store it in the database.

```py
def same_flag_check(team, user, challenge, flag, time):
    db = DBSession()

    # Check if team submitted flag from opposite team (from flag initiation)
    initiated_flags_check = db.query(Initiated_Flag).filter(Initiated_Flag.flag == flag).all()

    if initiated_flags_check:
        for initiated_flag in initiated_flags_check:
            if initiated_flag.team_id != team:
                flagged = Flagged(
                    flag=flag, team_id=team, user_id=user, challenge_id=challenge, flagging_time=time, flag_share_team=initiated_flag.team_id
                )
                db.add(flagged)
                db.commit()
                db.refresh(flagged)
                db.close()
                return
    
    # Check if team submitted flag from opposite team (from flag submission)
    submitted_flags_check = db.query(Submission).filter(Submission.flag == flag).all()

    if submitted_flags_check:
        for submitted_flag in submitted_flags_check:
            if submitted_flag.team_id != team:
                flagged = Flagged(
                    flag=flag, team_id=team, user_id=user, challenge_id=challenge, flagging_time=time
                )
                db.add(flagged)
                db.commit()
                db.refresh(flagged)
                db.close()
                return
```
The function `same_flag_check()` will compare the incoming requests' flag with the ones stored in the database. 
If the flag is found in the database and the team of the found flag is not the same as the one from the incoming request the submission will be flagged. 
This essentially captures any flag-sharers in the participants which are stupid enough to submit the same random generated flag.

```py
@app.get('/flagged', description='An endpoint to return flagged users based on same flag submissions or time based analysis of submissions.')
async def flagged():
    db = DBSession()

    flagged = db.query(Flagged).distinct(Flagged.team_id)

    db.close()

    flagged_entries = []

    for entry in flagged:
        entry_data = {
            'team_id': entry.team_id,
            'user_id': entry.user_id,
            'flag_share_team': entry.flag_share_team
        }

        flagged_entries.append(entry_data)

    return flagged_entries
```

The `flagged` API-endpoint checks the database for flagged users, it uses a query to fetch all the stored occurances of logged flag-sharing and return the vital information to the client which in our case is an admin dashboard. The vital information for the anti-cheat dashboard contains `team_id` which is the team that submitted the suspicious flag, `user_id` which is the user that submitted the suspicious flag and `flag_share_team` which is the team where the submitted flag was found.

By employing this methodology, the system will consistently scrutinize flag sharing with each new request, effectively identifying and flagging users who exhibit suspicious or cheating behavior.


___

Authors: Jannik S.
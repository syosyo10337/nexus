 

# posix cron sytanx

[https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html#tag_20_25_07)

```Plain
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌───────────── day of the week (0 - 6 or SUN-SAT)
│ │ │ │ │
* * * * *
```

例えば、毎日0:00 (JST）は以下のように表現する

```Plain
cron: "0 15 * * *" # UTC (JST 0:00)
```
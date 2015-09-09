# fontebot

Dave Fontebot is curious, warm, and welcoming. 

If you join [#hackers on Slack](http://hackathons.com), she will love you forever.

Dave Fontebot would love more features. Please send her a PR <3

# Contributing

## Setup
1. Clone this repository
1. `npm i`

## Local Testing
You can run fontebot locally by running the following `./bin/hubot` however there will be limited functionality as some plugins require environment variables or the Slack adapter.

## Configuration
To see which plugins require configuration you can run:
```bash
grep -o 'hubot-[a-z0-9_-]\+' external-scripts.json | \
  xargs -n1 -I {} sh -c 'sed -n "/^# Configuration/,/^#$/ s/^/{} /p" \
      $(find node_modules/{}/ -name "*.coffee")' | \
    awk -F '#' '{ printf "%-25s %s\n", $1, $2 }'
```

## Scripts
Scripts live in the `/scripts` director or can be installed via [npm](http://www.npmjs.org). If you add an external script, make sure to add it to the [external-scripts.json](external-scripts.json) file.

## Deployment
1. Visit the `<teamname>.slack.com/services` to add Hubot integration for your team.
1. `export HUBOT_SLACK_TOKEN=<your-slack-token>`
1. `bin/hubot -a slack`

A `Procfile` is also included for convenience.

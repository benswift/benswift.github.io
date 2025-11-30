---
title: "rclone: exclude all git repos"
tags: tools
---

For a long time I've used [rclone](https://rclone.org) for remote backups and
it's awesome. I have a script which syncs all the files I care about on my
laptop to cloudstor (which, being on the Australian university network has the
benefit that I get 1Gbps upload when I'm on the ANU network). My institution
(the ANU)

However, it turns out that
[cloudstor](https://support.aarnet.edu.au/hc/en-us/articles/5697089309711) is
shutting down at the end of this year, so I need to find a new home for my
backups. I've been told that the "replacement" is to use my institutional
OneDrive account.

My feelings about closing down useful (local) infrastructure and centralising
things on one of the big cloud providers notwithstanding, this should be an easy
change---[rclone supports OneDrive](https://rclone.org/onedrive/), so it's a
simple config change to move over.

However, I figured I'd take the opportunity to fix something which had long
bothered me. I have a _lot_ of stuff in git repos which don't need to be backed
up with rclone, and they just slow down the backup process. I wanted to get
rclone to ignore all git repos, and although it has an [include/exclude
filtering](https://rclone.org/filtering/) system it's not easy to get it to
filter all git repos (trust me, [I
checked](https://forum.rclone.org/t/ignore-all-git-repos-when-syncing/33023)).

Now that it's summertime I had a chance to make it work, and since that forum
thread is now locked I'm posting it here to save you some time, dear reader, if
you ever want to do this for yourself. Feel free to use/modify it (MIT Licence)
if it's helpful.

```bash
#!/bin/bash

EXCLUDE_FROM_FILE="/tmp/rclone-excludes.txt"
CLONE_ROOT_DIR=~/Documents
REMOTE=anu-onedrive

## find all git repo enclosing folders (including trailing slash), munge them
## into the form that rclone expects for its "exclude from" file
cd $CLONE_ROOT_DIR && find . -type d -name .git -exec  dirname {} \; | sed -e 's/$/\//' -e 's/^.//' > $EXCLUDE_FROM_FILE

## add a few extra excludes
echo ".DS_Store" >> $EXCLUDE_FROM_FILE

## sync to remote
rclone sync --progress --exclude-from=$EXCLUDE_FROM_FILE $CLONE_ROOT_DIR $REMOTE:mitch-rclone/$CLONE_ROOT_DIR
```

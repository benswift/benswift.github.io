---
title: Bulk-add students to MS Teams from a csv file
---

My institution now uses [MS Teams](http://teams.microsoft.com) for lots of
things, including organising classes & communicating with students. It's not
perfect, but it's not terrible, and the pros & cons of Teams as a pedagogical
platform are best left for another post.

Even though we're using MS Teams for class communication, it doesn't integrate
with our enrolment databases, so adding all the enrolled students into the
class's Teams site is either a frustrating, manual
one-at-a-time-through-the-teams-app affair, or a _share the "join Team" link on
some other communication channel and hope that you don't get too many
gatecrashers_ affair.

**Until now**.

Here's a snippet of [powershell](https://github.com/powershell/powershell) code
for bulk-adding students to a Team from a csv file[^brent]. The only
requirements are:

1. you can run a powershell on your machine

2. the Team already exists (and you know the Team name)

3. you've got a csv file which contains a column (with the heading `email`)
   which contains each student's email address

[^brent]: shout out to Brent Schuetze who first figured this out

Here's the script.

```powershell
# install the Teams module (if you haven't already)
Install-Module -Name MicrosoftTeams
Get-Module -ListAvailable -Name MicrosoftTeams

# this step will take you to a login page in your browser,
# you need to sign in to authorise your powershell session
Connect-MicrosoftTeams

# this line stores the team's GroupID into a variable
$GroupID = (Get-Team -DisplayName <TEAM NAME>).GroupID

# note: if you've used a different csv filename, change it in the command below
Import-Csv -Path emails.csv | foreach{Add-TeamUser -GroupId $GroupID -user $_.email}
```

When you're dealing with 500+ student classes, this can save you a _lot_ of
time.

One more note: while powershell is primarily a Microsoft thing, you can run it
on macOS or Linux as well. On my macOS machine I installed it through
[homebrew](https://brew.sh) with

```plaintext
brew install powershell

```

From the [powershell README.md](https://github.com/powershell/powershell) it
seems like there's a package available for most Linux distros as well.

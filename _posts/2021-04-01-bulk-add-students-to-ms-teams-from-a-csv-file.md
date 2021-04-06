---
title: Bulk-add students to MS Teams from a csv file
tags: tools
---

[My institution](https://anu.edu.au) now uses [MS
Teams](http://teams.microsoft.com) for lots of things, including organising
classes & communicating with students. It's not perfect, but it's not terrible,
and the pros & cons of Teams as a pedagogical platform are best left for another
post.

This post is about one particular pain point in every lecturer's workflow: even
though we're using MS Teams for class communication, it doesn't integrate with
our enrolment databases. This means that to add all the enrolled students into
the class's Teams site you can either:

- add them manually, one-at-a-time, through the Teams app; or

- share the "join Team" link on some other communication channel and manually
  weed out the gatecrashers

{:.hl-para}

Too much manual work---**there's gotta be a better way**.

MS Teams doesn't have a UI button for "add team members from [csv
file](https://en.wikipedia.org/wiki/Comma-separated_values)". The app _is_
scriptable, but only via a [PowerShell
module](https://docs.microsoft.com/en-us/MicrosoftTeams/teams-powershell-overview).
So, I (& others[^brent]) came up with a snippet of
[PowerShell](https://github.com/powershell/powershell) code for bulk-adding
students to a Team from a csv file.

The only requirements are:

1. you can run PowerShell on your machine

2. the Team already exists (and you know the Team name)

3. you've got a csv file which contains a column (with the heading `email`)
   which contains each student's email address

[^brent]: shout out to Brent Schuetze who first figured this out

## PowerShell script

```powershell
# install the Teams module (if you haven't already)
Install-Module -Name MicrosoftTeams
Get-Module -ListAvailable -Name MicrosoftTeams

# this step will take you to a login page in your browser,
# you need to sign in to authorise your PowerShell session
Connect-MicrosoftTeams

# this line stores the team's GroupID into a variable
$GroupID = (Get-Team -DisplayName <TEAM NAME>).GroupID

# note: if you've used a different csv filename, change it in the command below
Import-Csv -Path emails.csv | foreach {Add-TeamUser -GroupId $GroupID -user $_.email}
```

When you're dealing with 500+ student classes, this can save you a _lot_ of
time.

If you're worriedly thinking "that'd be awesome... if I used Windows", then I
have some good news: while PowerShell is primarily a Microsoft thing, it's on
macOS and Linux as well. On my macOS machine I installed it through
[homebrew](https://brew.sh) with:

```plaintext
brew install powershell
```

From the [PowerShell README.md](https://github.com/powershell/powershell) it
seems like there's a package available for most Linux distros as well.

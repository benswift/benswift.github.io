---
title: Pulling apart Zoom attendance csv dumps in tidy R
tags: tools
---

My team ran some Zoom training last week and today I needed to figure out who
actually attended across all the days, and for how long.

Zoom can give you a csv dump of all attendees but doesn't provide the
aggregations I was after, so I hacked up a little script (in [tidy
R](https://www.tidyverse.org)) to do it. If you ever want to do something
similar, feel free to use it ([MIT Licence](https://mit-license.org)).

```R
read_zoom_attendance_csv = function(filename){
  read_csv(filename, show_col_types = FALSE) %>%
    # I only needed the date, not the actual start time, so I didn't bother parsing
    # the full datetime + timezone string that Zoom gives
    mutate(date = parse_date(str_sub(`Join Time`, end = 10), format = "%m/%d/%Y")) %>%
    # this isn't necessary, but I like shorter column names
    rename(name = `Name (Original Name)`, email = `User Email`, duration = `Duration (Minutes)` ) %>%
    # I'm only intrested in these columns
    select(name, email, date, duration) %>%
    # this isn't necessary, but handy if individuals have signed in with
    # slightly different names on different days (requires eyeballing the data)
    mutate(name = recode(name,
                         "JS" = "Joanna Smith",
                         "Louise" = "Louise Jones"
}
```

Then you can read the Zoom csv file like so:

```R
df = read_zoom_attendance_csv("zoom-call.csv")
```

And to visualise in [ggplot2](https://ggplot2.tidyverse.org) (which was my
reason for using R in the first place) you could try something like:

```R
df %>%
  group_by(name, date) %>%
  # this was the key summarisation I was after - total time 
  # in-call across multiple connects/re-connects
  summarise(duration = sum(duration)) %>%
  ungroup() %>%
  ggplot(aes(name, duration)) +
  geom_col() +
  coord_flip() +
  facet_wrap(~date, nrow = 1) +
  labs(
    title = "Zoom call attendance",
    x = "participant name",
    y = "duration on the call (minutes)"
  )
```

Enjoy!

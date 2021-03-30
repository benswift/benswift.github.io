---
title: Two-way OSC communication between Extempore and Pd
tags: extempore lens
---

Because [Extempore](https://github.com/digego/extempore) and
[Pd](https://puredata.info) are both multimedia programming environments, they
both speak [OSC](https://en.wikipedia.org/wiki/Open_Sound_Control) straight out
of the box. If you need to send messages (numbers, strings, other data) from one
program to the other over the local network[^lan] then OSC is a pretty good way
to do it.

[^lan]:
    even if you're on a WAN, there are ways to do it---but you might have to
    deal with some packet loss and
    [NAT](https://en.wikipedia.org/wiki/Network_address_translation) issues

## Pd->Extempore

To send OSC messages from Pd to Extempore, you'll first need to start Extempore,
define a function to act as the OSC callback/handler, and start the OSC server
listening on a particular port.

```xtlang
;; the name of this function doesn't matter, as long as you specify the same
;; name later when you start the server
(define (osc-receive-handler timestamp address . args)
  (println 'osc-receive-handler address '-> args))

;; start the server listening on port 7009
(io:osc:start-server 7009 "osc-receive-handler")
```

Once you evaluate those lines you'll see a notification printed in the Extempore
terminal:

    Starting OSC server on port: 7009 calling back to osc-receive-handler

Now that Extempore's listening, you need to send a message with Pd. There's a
built-in `oscformat` object for this. As usual in Pd, the easiest way to see how
it works is to create an `oscformat` object, then right-click to open up the
`oscformat-help.pd` patch.

Assuming you're running Pd on the same computer as the Extempore OSC server you
set up before, you can send your messages to `localhost` (look for the
`connect localhost 5000` message in the Pd help patch). However, you need to
make sure the ports match---the Extempore server is listening on port `7099`,
while the default port number in the `oscformat-help.pd` patch is `5000` (so
you'll need to change it before you send that `connect message`).

Once you've done all that, you should be able to trigger the send messages (e.g.
`1 2 3`) near the top of the patch. They'll be received by Extempore and passed
as arguments to the `osc-receive-handler` function, which (as defined above)
just prints them to the log, so you'll see output like this:

    osc-receive-handler "/cat/horse/pig" -> (1.000000 2.000000 3.000000)
    osc-receive-handler "/cat/horse/pig" -> (4.000000 5.000000 "weasel" 6.000000 7.000000 "rat")
    osc-receive-handler "/mouse/banana" -> (1.000000 2.000000 3.000000)

Success! 🙌🎉🙌 Now, re-define your `osc-receive-handler` to do something more
interesting and you're away.

## Extempore->Pd

Sending OSC messages the opposite direction is pretty similar. In this case,
it's Pd's `oscparse` object that you'll need. Again, go ahead an open up the
`oscparse-help.pd` patch. Find the "packets from network" part of the patch
(again, make note of the port the server is listening on) and send the `listen`
message to start Pd listening for incoming OSC messages.

Then, start Extempore and start a listener again as before. You might not _use_
this part if you're just sending data out of Extempore, but it's required to set
up some of the internal OSC infrastructure so you need to do it anyway.

```xtlang
;; the name of this function doesn't matter, as long as you specify the same
;; name later when you start the server
(define (osc-receive-handler timestamp address . args)
  (println 'osc-receive-handler address '-> args))

;; start the server listening on port 7009
(io:osc:start-server 7009 "osc-receive-handler")
```

Then, it's a one-liner to send an OSC message to a particular host & port:

```xtlang
(io:osc:send (now) (cons "localhost" 7010) "/test/msg" "Hello" 500 6.6 "World" (random 10))
```

After the address argument (in this case `"/test/msg"`) you can supply as many
arguments as you like---you just need to make sure you unpack them properly on
the Pd side.

This time, if the messages gets through ok you'll see the message received in
your Pd log view, with stuff like:

    parse-output: list test msg Hello 500 6.6 World 8
    parse-output: list test msg Hello 500 6.6 World 0
    parse-output: list test msg Hello 500 6.6 World 9

...plus a bunch more debugging output from the `oscparse-help.pd` patch.

As in the Pd->Extempore case, you're sending the message to localhost, so if
Extempore and Pd are running on the same machine then you'll be golden. If
you're on a LAN, you'd need to specify the host & port with something like
`(cons "192.168.11.15" 7011)` or whatever.

The one other thing to note about the `io:osc:send` function is that the first
argument is a _time_ argument. If you wanted to, e.g. send a message with a
2-second delay after evaluating that line, you could do something like:

```xtlang
(io:osc:send (+ (now) (* *second* 2)) (cons "localhost" 7010) "/test/msg" "Hello" 500 6.6 "World" (random 10))
```

For a deeper dive on how time is handled in Extempore, see the
[Extempore docs](https://extemporelang.github.io/docs/overview/time/).

Happy OSCing 😊

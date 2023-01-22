---
title: Handling Square Webhooks in Phoenix
tags: web elixir phoenix
---

My [brother's
cafe](https://the-riotact.com/hot-in-the-suburbs-little-luxton-serves-up-coffee-for-the-community/618459)
donates a dollar to the local community centre for every coffee sold, and over
the summer I built
him a live "donation counter" which displays a small "thankyou" animation when
anyone buys a coffee. It's a web app which they run on an iPad sitting on the
coffee machine.

Since the cafe uses Square for all payments, I was able to set up a
[webhook](https://developer.squareup.com/docs/webhooks/overview) so the app
would receive the "new sale" notification ASAP---this should be both
lower-latency and more efficient than polling.

The app is basically a single [Phoenix
LiveView](https://www.phoenixframework.org). Sadly the Square guides don't have
examples for Elixir, although it's pretty easy to modify the e.g. [Ruby
example](https://developer.squareup.com/docs/webhooks/step3validate) code to get
the job done. If you're looking to do something similar I cobbled together this
info from docs (and a few blogs) and it might help you out to have it all in one
place.

## Step 1: set up webhook controller (including validation)

It's important to validate that any incoming webhook is actually from Square, so
Square send a special `x-square-hmacsha256-signature` header for [validation
purposes](https://developer.squareup.com/docs/webhooks/step3validate), although
performing this validation step requires having access to the raw request body.
Thankfully, the ["Custom Body Reader" section in the `Plug.Parsers`
docs](https://hexdocs.pm/plug/Plug.Parsers.html#module-custom-body-reader) shows
how to do exactly that---just follow the instructions there.

## Step 2: create webhook controller (including validation)

The webhook controller module should look something like this:

```elixir
defmodule MyAppWeb.SquareWebhookController do
  @moduledoc """
  Handle webhooks sent from Square.

  """
  use MyAppWeb, :controller

  @doc "handle the webhook request"
  def webhook(conn, params) do
    if is_from_square?(conn) do
      do_stuff(params)
    end

    send_response(conn)
  end

  @doc "respond to the Square server (always 200 OK otherwise they'll freak out)"
  defp send_response(conn) do
    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, "webhook received - thanks.")
  end

  @doc "returns `true` if webhook came from Square, `false` otherwise"
  defp is_from_square?(conn) do
    notification_url = "http://example.com/square/webhook"
    signature_key = "WEBHOOK_SIGNATURE_KEY_FROM_SQUARE"
    {_, signature} = List.keyfind!(conn.req_headers, "x-square-hmacsha256-signature", 0)

    ## here's where we access the raw request body we put there in the Plug.Parser
    raw_body = Enum.join(conn.assigns.raw_body)

    hash =
      :crypto.mac(:hmac, :sha256, signature_key, notification_url <> raw_body)
      |> Base.encode64()

    signature == hash
  end
end
```

## Step 3: add the endpoint to your router

Finally, add it to to your `router.ex` - something like this, you know the
drill.

```elixir
scope "/square", MyAppWeb do
  pipe_through :api

  post "/webhook", SquareWebhookController, :webhook
end
```

## And you're done!

After that's all done (and you've deployed your app) you're ready for it to
receive webhooks from Square. You can set that up through your [Square
developer](https://developer.squareup.com/), and once you've created a webhook
you can even send a "test" payload just to check everything's working.

Have fun! And if you live in Canberra, especially in Tuggeranong/Lanyon, maybe
go buy a coffee from [Little Luxton](https://www.littleluxton.com) and you can
see it for yourself 😊

---
title: Cutting ruby CI pipeline times with pre-installed bundles
tags: tools web
---

I (and, increasingly many of my colleagues) are using
[Jekyll](https://jekyllrb.com) to create open (CC-licenced), hackable, acessible
course websites & teaching content for our classes. We use a self-hosted GitLab
server for all the websites sources, and then build/deploy them with [GitLab
CI](https://docs.gitlab.com/ee/ci/). It works well, it means I don't have to
fight with our LMS to do interesting things, and it means I can open my learning
materials to everyone (not just those who are privileged enough to be able to
pay the fees to study at the ANU).

The `jekyll build` step runs in a container, and for a long time we've just used
the [official ruby image](https://hub.docker.com/_/ruby/) as a starting point,
then done a `bundle install` inside the container before running the build step
to get all the deps. However, this means the deps are _installed from scratch on
every deploy_, which isn't the greenest (although ANU is [heading in a good
direction on net
zero](https://www.anu.edu.au/research/research-initiatives/anu-below-zero)) and
it also means the feedback loop from push->deployed site is much longer than it
needs to be.

Yesterday (prompted by the understandable frustrations of my colleague
[Charles](https://charlesmartin.com.au) about the build times) I spent some time
fixing things. I ended up creating a new docker image with the required gems
pre-installed, and it **cut our CI pipeline times by up to 90%** (i.e. a 10x
speedup).

There were a couple of tricky parts, so I include some commentary here in case
anyone else (including future me when if I forget how this works) wants to do
similar things.

```Dockerfile
# Choose and name our temporary image.
FROM ruby:3.0.2 as builder

WORKDIR /app

# Take an SSH key as a build argument.
ARG SSH_PRIVATE_KEY

# required to pull from the (private) theme gem repos
# create the SSH directory.
RUN mkdir -p ~/.ssh/ && \
  # populate the private key file.
  echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa && \
  # set the required permissions.
  chmod -R 600 ~/.ssh/ && \
  # add our GitLab server to our list of known hosts for ssh.
  ssh-keyscan -t rsa gitlab.anu.edu.au >> ~/.ssh/known_hosts

# install the deps - this is really just for "caching", the expectation is that
# the CI job will re-run `bundle install` to pick up any differences
COPY Gemfile Gemfile.lock* .
RUN bundle install

# Choose the base image for our final image
FROM ruby:3.0.2
WORKDIR /app

# Copy across the files from our `builder` container
# this really assumes the same base container
COPY --from=builder $BUNDLE_APP_CONFIG $BUNDLE_APP_CONFIG
```

The main tricky bit is the ssh setup, because some of the (in-house) gems are
only available in git repos which require authentication. This Dockerfile pulls
in the SSH key from an environment variable, then uses it to `bundle install`
the required gems. Then, the key part is that there's a second `FROM` command to
create a new image (sans any trace of the SSH key) and only the installed gems
are copied across.

To build the container, you need to do something like

```shell
MY_KEY=$(cat gitlab-ci-runner-key)
docker build --build-arg SSH_PRIVATE_KEY="$MY_KEY" --tag YOUR_TAG_NAME .
```

A couple of caveats with this approach: the container just caches the gems; the
`bundle install` step will still (probably) need to run in the CI pipeline, but
it'll be a no-op if `Gemfile.lock` hasn't changed. You'll never be worse off
(time-wise) than if you're installing from scratch, because only the deps which
have changed in the lock file will be downloaded. But over time, the container
may take longer to run as the list of pre-installed vs actually required
packages diverges.

{:.hl-para}

I did try a similar approach that used `bundle cache` to pull all the deps into
a `vendor/cache` folder and then copy _that_ across into the new image, but I
had weird permissions errors that I didn't have the time to figure out. If
you've got tips on whether that's a more "bundler-y" way to do things then [hit
me up](mailto:ben@benswift.me).

I want to give a shoutout to Jan Akerman who wrote [a helpful blog
post](https://janakerman.co.uk/docker-git-clone/) which got me started---and
some of the Dockerfile is taken from that post.

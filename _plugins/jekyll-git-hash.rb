# frozen_string_literal: true

# Jekyll plugin for generating Git hash
#
# Place this file in the _plugins directory and
# use {{ site.data["git-HEAD"] }} in your Liquid templates
#
# Author: Yegor Bugayenko <yegor@tpc2.com>
# Source: https://github.com/yegor256/jekyll-git-hash
#
# Distributed under the MIT license
# Copyright Yegor Bugayenko, 2014

module Jekyll
  class GitHashGenerator < Generator
    priority :high
    safe true
    def generate(site)
      hash = `git rev-parse --short HEAD`.strip
      site.data['git-HEAD'] = hash
    end
  end
end

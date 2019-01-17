BASE_HTML_DIR=_site
GH_USERNAME=benswift
SSH_REPO_ADDRESS=git@github.com:$(GH_USERNAME)/$(GH_USERNAME).github.io.git

all: push

init:
	mkdir -p $(BASE_HTML_DIR) && cd $(BASE_HTML_DIR) && git init . && git remote add origin $(SSH_REPO_ADDRESS)

# in case you actually blow away the git repo _site
reclone:
	git clone --single-branch --branch master $(SSH_REPO_ADDRESS) _site

generate-blog:
	bundle exec jekyll build

commit-all: generate-blog
	cd $(BASE_HTML_DIR) && git add . && git commit -m "update blog"

push: commit-all
	cd $(BASE_HTML_DIR) && git push origin master

# here's the benswift.me-specific stuff

highlight.js:
	browserify node_modules/highlight.js/lib/index.js > assets/js/highlight.js

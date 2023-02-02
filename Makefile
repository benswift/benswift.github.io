BASE_HTML_DIR=_site
GH_USERNAME=benswift
SSH_REPO_ADDRESS=git@github.com:$(GH_USERNAME)/$(GH_USERNAME).github.io.git
SOURCE_GIT_REF := $(shell git rev-parse --short source)

JEKYLL_ENV=production
RUBY_YJIT_ENABLE=true

all: push

init:
	mkdir -p $(BASE_HTML_DIR) && cd $(BASE_HTML_DIR) && git init . && git remote add origin $(SSH_REPO_ADDRESS)

# in case you actually blow away the git repo _site
reclone:
	git clone --single-branch --depth 1 --branch master $(SSH_REPO_ADDRESS) _site

generate-blog:
	bundle exec jekyll build

commit-all: generate-blog
	cd $(BASE_HTML_DIR) && git add . && git commit -m "update blog (built from $(SOURCE_GIT_REF))"

push: commit-all
	# push the source branch to GH as well, since it's linked to from the built site
	git push origin source
	# now push the built files
	cd $(BASE_HTML_DIR) && git push origin master

prettier:
	# will modify the files in place
	prettier --write --prose-wrap always .

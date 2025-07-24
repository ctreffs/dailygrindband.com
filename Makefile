INSTALLED_RUBY_VERSION := $(shell rbenv version | awk '{print $$1}')
REQUIRED_RUBY_VERSION := $(shell cat .ruby-version)
BOOTSTRAP_PATH := $(shell bundle info bootstrap | grep "Path:" | awk '{print $$2}')
POPPER_PATH := $(shell bundle info popper | grep "Path:" | awk '{print $$2}')

.PHONY: set-local-path
set-local-path:
	bundle config set --local path 'vendor/bundle'
.PHONY: setup-env
setup-env:
	brew install rbenv ruby-build git-lfs --quiet
	brew link rbenv ruby-build git-lfs --quiet
	
	@if [ "$(INSTALLED_RUBY_VERSION)" != "$(REQUIRED_RUBY_VERSION)" ]; then \
		echo "Updating ruby"; \
		brew upgrade ruby-build; \
		rbenv install -s; \
	fi

	gem install bundler --quiet
	bundle config set --local path 'vendor/bundle'
	bundle install --quiet
	git lfs install

.PHONY: install
install: set-local-path
	bundle install

.PHONY: setup-bootstrap
setup-bootstrap:
	mkdir -p _sass/bootstrap
	cp -r ${BOOTSTRAP_PATH}/assets/stylesheets/* _sass/bootstrap/

	mkdir -p assets/js/bootstrap
	cp -r ${BOOTSTRAP_PATH}/assets/javascripts/* assets/js/bootstrap/

	mkdir -p assets/js/popper
	cp -r ${POPPER_PATH}/assets/javascripts/* assets/js/popper/

.PHONY: update
update:
	bundle update

.PHONY: clean
clean: set-local-path
	bundle exec jekyll clean

.PHONY: serve
serve: clean
	bundle exec jekyll serve

.PHONY: build
build: clean
	bundle exec jekyll build

.PHONY: doctor
doctor: set-local-path
	bundle exec jekyll doctor

.PHONY: check
check: install
	bundle exec htmlproofer --enforce_https --ignore-status-codes "301,403,405,429" ./_site

.PHONY: import-news-asset
import-news-asset:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make import-asset FILE=\"path/to/your/video.mp4\""; \
		exit 1; \
	fi
	@echo "Importing and converting asset: $(FILE)"; \
	mkdir -p assets/videos/news; \
	OUTPUT_FILENAME=$$(basename "$(FILE)"); \
	ffmpeg -i "$(FILE)" -vf "scale=1024:-1" -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 128k "assets/videos/news/$${OUTPUT_FILENAME}"; \
	echo "\n✅ Successfully converted and moved to assets/videos/news/$${OUTPUT_FILENAME}"; \
	echo "You can now reference '/assets/videos/news/$${OUTPUT_FILENAME}' in your post's assets."
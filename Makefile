INSTALLED_RUBY_VERSION := $(shell rbenv version 2>/dev/null | awk '{print $$1}')
REQUIRED_RUBY_VERSION := $(shell cat .ruby-version)
BOOTSTRAP_PATH := $(shell bundle info bootstrap | grep "Path:" | awk '{print $$2}')
POPPER_PATH := $(shell bundle info popper | grep "Path:" | awk '{print $$2}')

.PHONY: set-local-path
set-local-path:
	bundle config set --local path 'vendor/bundle'
.PHONY: setup-env
setup-env:
	@command -v rbenv >/dev/null 2>&1 || (brew install rbenv --quiet && brew link rbenv --quiet)
	@command -v ruby-build >/dev/null 2>&1 || (brew install ruby-build --quiet && brew link ruby-build --quiet)
	@command -v git-lfs >/dev/null 2>&1 || (brew install git-lfs --quiet && brew link git-lfs --quiet)
	
	@if [ "$(INSTALLED_RUBY_VERSION)" != "$(REQUIRED_RUBY_VERSION)" ]; then \
		echo "Updating ruby and cleaning vendor/bundle to ensure compatibility"; \
		brew upgrade ruby-build && \
		rbenv install -s && \
		rm -rf vendor/bundle; \
	fi

	gem install bundler --quiet
	bundle config set --local path 'vendor/bundle'
	bundle install --quiet
	git lfs install

.PHONY: clean-vendor
clean-vendor:
	rm -rf vendor/bundle
	rm -rf .bundle/config

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
	@cache_dir=$$(mktemp -d "$${TMPDIR:-/tmp}/htmlproofer.XXXXXX"); \
	trap 'rm -rf "$$cache_dir"' EXIT; \
	cache_config="{\"timeframe\":{\"external\":\"1h\"},\"storage_dir\":\"$$cache_dir\"}"; \
	deadline=$$(( $$(date +%s) + 120 )); \
	delay=5; \
	attempt=1; \
	while :; do \
		now=$$(date +%s); \
		remaining=$$((deadline - now)); \
		if [ "$$attempt" -gt 1 ] && [ "$$remaining" -le 0 ]; then \
			echo "HTMLProofer still has transient link failures after 120 seconds."; \
			exit 1; \
		fi; \
		request_timeout=60; \
		connect_timeout=30; \
		if [ "$$remaining" -lt "$$request_timeout" ]; then request_timeout=$$remaining; fi; \
		if [ "$$remaining" -lt "$$connect_timeout" ]; then connect_timeout=$$remaining; fi; \
		typhoeus="{\"timeout\": $$request_timeout, \"connecttimeout\": $$connect_timeout}"; \
		output=$$(bundle exec htmlproofer \
			--enforce_https \
			--ignore-status-codes "301,403,405,429" \
			--ignore-urls "/googletagmanager\.com/" \
			--swap-urls "^https\://dailygrindband\.com:" \
			--cache "$$cache_config" \
			--typhoeus "$$typhoeus" \
			./_site 2>&1); \
		status=$$?; \
		printf '%s\n' "$$output"; \
		if [ "$$status" -eq 0 ]; then exit 0; fi; \
		failure_lines=$$(printf '%s\n' "$$output" | grep -iE 'External link .* failed' || true); \
		if [ -z "$$failure_lines" ]; then exit "$$status"; fi; \
		nonretryable_failures=$$(printf '%s\n' "$$failure_lines" | grep -Evi 'status code (408|5[0-9][0-9])|response code 0|time.?out|failed with something very wrong' || true); \
		if [ -n "$$nonretryable_failures" ]; then exit "$$status"; fi; \
		now=$$(date +%s); \
		remaining=$$((deadline - now)); \
		if [ "$$remaining" -le 0 ]; then \
			echo "HTMLProofer still has transient link failures after 120 seconds."; \
			exit "$$status"; \
		fi; \
		wait=$$delay; \
		if [ "$$wait" -gt "$$remaining" ]; then wait=$$remaining; fi; \
		echo "Transient external-link failure; retrying in $${wait}s (120s limit)."; \
		sleep "$$wait"; \
		delay=$$((delay * 2)); \
		if [ "$$delay" -gt 30 ]; then delay=30; fi; \
		attempt=$$((attempt + 1)); \
	done

.PHONY: import-video-asset
import-video-asset:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make import-video-asset FILE=\"path/to/your/video.mp4\""; \
		exit 1; \
	fi
	@echo "Importing and converting video asset: $(FILE)"; \
	mkdir -p assets/videos/news; \
	OUTPUT_FILENAME=$$(basename "$(FILE)"); \
	ffmpeg -i "$(FILE)" -vf "scale=1024:-1" -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 128k "assets/videos/news/$${OUTPUT_FILENAME}"; \
	echo "\n✅ Successfully converted and moved to assets/videos/news/$${OUTPUT_FILENAME}"; \
	echo "You can now reference '/assets/videos/news/$${OUTPUT_FILENAME}' in your post's assets."

.PHONY: import-image-asset
import-image-asset:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make import-image-asset FILE=\"path/to/your/image.jpg\""; \
		exit 1; \
	fi
	@echo "Importing and converting image asset: $(FILE)"; \
	mkdir -p assets/images/news; \
	BASENAME=$$(basename "$(FILE)"); \
	OUTPUT_FILENAME="$${BASENAME%.*}.webp"; \
	ffmpeg -i "$(FILE)" -vf "scale=1024:-1" "assets/images/news/$${OUTPUT_FILENAME}"; \
	echo "\n✅ Successfully converted and moved to assets/images/news/$${OUTPUT_FILENAME}"; \
	echo "You can now reference '/assets/images/news/$${OUTPUT_FILENAME}' in your post's assets."
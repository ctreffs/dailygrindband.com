INSTALLED_RUBY_VERSION := $(shell rbenv version | awk '{print $$1}')
REQUIRED_RUBY_VERSION := $(shell cat .ruby-version)

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
	bundle install --quiet
	git lfs install

.PHONY: install
install:
	bundle install

.PHONY: serve
serve:
	bundle exec jekyll serve

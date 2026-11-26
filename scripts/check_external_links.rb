# frozen_string_literal: true

require "html-proofer"
require "uri"

amazon_user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

proofer = HTMLProofer.check_directory("./_site", {
  enforce_https: true,
  ignore_urls: [/googletagmanager\.com/],
  swap_urls: { %r{\Ahttps://dailygrindband\.com} => "" },
  typhoeus: { timeout: 60, connecttimeout: 30 },
  log_level: :debug,
})

proofer.before_request do |request|
  next unless ["amazon.de", "www.amazon.de"].include?(URI.parse(request.base_url).host)

  request.options[:headers] ||= {}
  request.options[:headers]["User-Agent"] = amazon_user_agent
  proofer.logger.log(:debug, "Using Amazon-specific User-Agent for #{request.base_url}")
end

proofer.run

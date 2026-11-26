# frozen_string_literal: true

require "html-proofer"

amazon_user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

proofer = HTMLProofer.check_directory("./_site", {
  enforce_https: true,
  ignore_status_codes: [301, 403, 405, 429],
  ignore_urls: [/googletagmanager\.com/],
  swap_urls: { %r{\Ahttps://dailygrindband\.com} => "" },
  typhoeus: { timeout: 60, connecttimeout: 30 },
})

proofer.before_request do |request|
  next unless ["https://amazon.de", "https://www.amazon.de"].include?(request.base_url)

  request.options[:headers] ||= {}
  request.options[:headers]["User-Agent"] = amazon_user_agent
end

proofer.run

# frozen_string_literal: true

require "html-proofer"
require "uri"

AMAZON_HOSTS = ["amazon.de", "www.amazon.de"].freeze
AMAZON_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
TYPHOEUS_OPTIONS = { timeout: 60, connecttimeout: 30, followlocation: true }.freeze
# Amazon and Instagram throttle CI runner IPs intermittently; a later request often succeeds.
RETRY_BUDGET_SECONDS = 30
RETRY_MAX_DELAY_SECONDS = 60

def amazon?(url)
  AMAZON_HOSTS.include?(URI.parse(url).host)
rescue URI::InvalidURIError
  false
end

def retryable?(failure)
  failure.status.nil? || failure.status.zero? || failure.status == 408 || failure.status >= 500
end

def retry_delay(response, fallback)
  retry_after = response.headers&.[]("Retry-After").to_s
  delay = retry_after.match?(/\A\d+\z/) ? retry_after.to_i : fallback
  delay.clamp(1, RETRY_MAX_DELAY_SECONDS)
end

# Re-requests only the URLs that failed transiently; a URL passes only on a real 2xx response.
module RetryTransientExternalFailures
  def report_failed_checks
    pending = @failures.filter_map do |failure|
      next unless failure.check_name == "Links > External" && retryable?(failure)

      failure.description[/\AExternal link (\S+) failed/, 1]
    end.uniq
    return super if pending.empty?

    # HTMLProofer leaves its logger in Ethon, which lacks `debug?` and breaks single requests.
    Ethon.logger = Logger.new(nil)
    deadline = Time.now + RETRY_BUDGET_SECONDS
    delay = 5
    recovered = []

    until pending.empty? || Time.now >= deadline
      wait = [delay, deadline - Time.now].min
      @logger.log(:info, "Retrying #{pending.length} external link(s) in #{wait.round}s: #{pending.join(", ")}")
      sleep(wait)

      next_delay = delay * 2
      pending = pending.reject do |url|
        headers = amazon?(url) ? { "User-Agent" => AMAZON_USER_AGENT } : {}
        response = Typhoeus.get(url, **TYPHOEUS_OPTIONS, headers: headers)
        @logger.log(:info, "Retry received a #{response.code} for #{url}")
        next_delay = [next_delay, retry_delay(response, next_delay)].max unless response.success?
        recovered << url if response.success?
      end
      delay = [next_delay, RETRY_MAX_DELAY_SECONDS].min
    end

    @failures.reject! { |failure| recovered.any? { |url| failure.description.start_with?("External link #{url} failed") } }
    @reporter.failures = @failures
    return super unless @failures.empty?

    @logger.log(:info, "HTML-Proofer finished successfully after retrying #{recovered.length} external link(s).")
  end
end

proofer = HTMLProofer.check_directory("./_site", {
  enforce_https: true,
  # 429: Instagram rate-limits CI runner IPs for longer than any retry budget.
  ignore_status_codes: [301, 403, 405, 429],
  ignore_urls: [/googletagmanager\.com/],
  swap_urls: { %r{\Ahttps://dailygrindband\.com} => "" },
  typhoeus: TYPHOEUS_OPTIONS,
  log_level: :debug,
})
proofer.singleton_class.prepend(RetryTransientExternalFailures)

proofer.before_request do |request|
  next unless amazon?(request.base_url)

  request.options[:headers] ||= {}
  request.options[:headers]["User-Agent"] = AMAZON_USER_AGENT
  proofer.logger.log(:debug, "Using Amazon-specific User-Agent for #{request.base_url}")
end

proofer.run

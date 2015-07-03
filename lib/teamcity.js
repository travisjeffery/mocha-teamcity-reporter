// not relevant any more var Base;
var log = console.log;

if (process) {
  log = function(msg) {
    process.stdout.write(msg + '\n');
  };
}


/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Teamcity(runner) {
  var stats = {};

  runner.on('start', function(){
    stats.start = new Date();
  });

  runner.on('suite', function(suite) {
    suite.startDate = new Date();
    if (suite.root) return;
    log("##teamcity[testSuiteStarted name='" + escape(suite.title) + "']");
  });

  runner.on('test', function(test) {
    log("##teamcity[testStarted name='" + escape(test.title) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
    log("##teamcity[testFailed name='" + escape(test.title) + "' message='" + escape(err.message) + "' captureStandardOutput='true']");
  });

  runner.on('pending', function(test) {
    log("##teamcity[testIgnored name='" + escape(test.title) + "' message='pending']");
  });

  runner.on('test end', function(test) {
    log("##teamcity[testFinished name='" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    log("##teamcity[testSuiteFinished name='" + escape(suite.title) + "' duration='" + (new Date() - suite.startDate) + "']");
  });

  runner.on('end', function() {
    log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + (new Date() - stats.start) + "']");
  });
}

/**
 * Escape the given `str`.
 */

function escape(str) {
  if (!str) return '';
  return str
      .toString()
      .replace(/\|/g, "||")
      .replace(/\n/g, "|n")
      .replace(/\r/g, "|r")
      .replace(/\[/g, "|[")
      .replace(/\]/g, "|]")
      .replace(/\u0085/g, "|x")
      .replace(/\u2028/g, "|l")
      .replace(/\u2029/g, "|p")
      .replace(/'/g, "|'");
}

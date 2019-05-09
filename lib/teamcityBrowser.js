/*eslint max-len: ["error", { "code": 220 }]*/

'use strict';
/**
 * Teamcity doc reference https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 *
 * Module dependencies.
 */
var Base = window.Mocha.reporters.Base;
var log;
if(typeof window.customLogFunction === 'function'){
	log = window.customLogFunction;
} else{
	log = console.log;
}


function escape(str) {
	if (!str) return '';
	return str
		.toString()
		.replace(/\x1B.*?m/g, '') // eslint-disable-line no-control-regex
		.replace(/\|/g, '||')
		.replace(/\n/g, '|n')
		.replace(/\r/g, '|r')
		.replace(/\[/g, '|[')
		.replace(/\]/g, '|]')
		.replace(/\u0085/g, '|x')
		.replace(/\u2028/g, '|l')
		.replace(/\u2029/g, '|p')
		.replace(/'/g, '|\'');
}

/**
 * Initialize a new `Teamcity` reporter for the browser.
 *
 * @param {Runner} runner
 * @param {options} options
 * @api public
 */
function teamcity(runner) {
	Base.call(this, runner);
	var stats = this.stats;
	var flowId = document.title || new Date().getTime();

	runner.on('suite', function (suite) {
		if (suite.root) return;
		suite.startDate = new Date();
		log('##teamcity[testSuiteStarted name=\'' + escape(suite.title) + '\' flowId=\'' + flowId + '\']');
	});

	runner.on('test', function (test) {
		log('##teamcity[testStarted name=\'' + escape(test.title) + '\' flowId=\'' + flowId + '\'  captureStandardOutput=\'true\']');
	});

	runner.on('fail', function (test, err) {
		log('##teamcity[testFailed name=\'' + escape(test.title) + '\' flowId=\'' + flowId + '\' message=\'' + escape(err.message) + '\' captureStandardOutput=\'true\' details=\'' + escape(err.stack) + '\']');
	});

	runner.on('pending', function (test) {
		log('##teamcity[testIgnored name=\'' + escape(test.title) + '\' flowId=\'' + flowId + '\' message=\'pending\']');
	});

	runner.on('test end', function (test) {
		log('##teamcity[testFinished name=\'' + escape(test.title) + '\' flowId=\'' + flowId + '\' duration=\'' + test.duration + '\']');
	});

	runner.on('suite end', function (suite) {
		if (suite.root) return;
		log('##teamcity[testSuiteFinished name=\'' + escape(suite.title) + '\' duration=\'' + (new Date() - suite.startDate) + '\' flowId=\'' + flowId + '\']');
	});

	runner.on('end', function () {
		var duration;
		(typeof stats === 'undefined') ? duration = '0' : duration = stats.duration;
		log('##teamcity[testSuiteFinished name=\'mocha.suite\' duration=\'' + duration + '\' flowId=\'' + flowId + '\']');
	});
}

window.Mocha.reporters.teamcity = teamcity;

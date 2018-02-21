/**
 * Teamcity doc reference https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 *
 * Module dependencies.
 */
'use strict';

const util = require('util');

const processPID = process.pid.toString();
const TEST_IGNORED = `##teamcity[testIgnored name='%s' message='%s' flowId='%s']`;
const SUITE_START = `##teamcity[testSuiteStarted name='%s' flowId='%s']`;
const SUITE_END = `##teamcity[testSuiteFinished name='%s' duration='%s' flowId='%s']`;
const TEST_START = `##teamcity[testStarted name='%s' captureStandardOutput='true' flowId='%s']`;
const TEST_FAILED = `##teamcity[testFailed name='%s' message='%s' details='%s' captureStandardOutput='true' flowId='%s']`;
const TEST_END = `##teamcity[testFinished name='%s' duration='%s' flowId='%s']`;
let Base, log;

if (typeof window === 'undefined') {
	// running in Node
	Base = require('mocha').reporters.Base;
	log = console.log;
} else if (window.Mocha && window.Mocha.reporters && window.Mocha.reporters.Base) {
	// running in browser (possibly phantomjs) but without require
	Base = window.Mocha.reporters.Base;
	log = console.log;
} else {
	// running in mocha-phantomjs
	Base = require('./base');
	log = function (msg) {
		process.stdout.write(msg + '\n');
	};
}

/**
 * Escape the given `str`.
 */

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

function formatString() {
	let formattedArguments = [];
	const args = Array.prototype.slice.call(arguments, 0);
	// Format all arguments for TC display (it escapes using the pipe char).
	let tcMessage = args.shift();
	args.forEach((param) => {
		formattedArguments.push(escape(param));
	});
	formattedArguments.unshift(tcMessage);
	return util.format.apply(util, formattedArguments);
}


/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @param {options} options
 * @api public
 */

function Teamcity(runner, options) {
	options = options || {};
	const reporterOptions = options.reporterOptions || {};
	let flowId;
	(reporterOptions.flowId) ? flowId = reporterOptions.flowId : flowId =  process.env['MOCHA_TEAMCITY_FLOWID'] || processPID;
	Base.call(this, runner);
	let stats = this.stats;
	const topLevelSuite = reporterOptions.topLevelSuite || process.env['MOCHA_TEAMCITY_TOP_LEVEL_SUITE'];

	runner.on('suite', function (suite) {
		if (suite.root) {
			if (topLevelSuite) {
				log(formatString(SUITE_START, topLevelSuite, flowId));
			}
			return;
		}
		suite.startDate = new Date();
		log(formatString(SUITE_START, suite.title, flowId));
	});

	runner.on('test', function (test) {
		log(formatString(TEST_START, test.title, flowId));
	});

	runner.on('fail', function (test, err) {
		log(formatString(TEST_FAILED, test.title, err.message, err.stack, flowId));
	});

	runner.on('pending', function (test) {
		log(formatString(TEST_IGNORED, test.title, test.title, flowId));
	});

	runner.on('test end', function (test) {
		log(formatString(TEST_END, test.title, test.duration, flowId));
	});

	runner.on('suite end', function (suite) {
		if (suite.root) return;
		log(formatString(SUITE_END, suite.title, new Date() - suite.startDate, flowId));
	});

	runner.on('end', function () {
		if (topLevelSuite) {
			log(formatString(SUITE_END, topLevelSuite, stats.duration, flowId));
		}
		log(formatString(SUITE_END, 'mocha.suite', stats.duration, flowId));
	});
}


/**
 * Expose `Teamcity`.
 */

if (typeof window !== 'undefined' && window.Mocha && window.Mocha.reporters) {
	window.Mocha.reporters.teamcity = Teamcity;
} else {
	exports = module.exports = Teamcity;
}

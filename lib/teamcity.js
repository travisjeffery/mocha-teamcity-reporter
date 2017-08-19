/**
 * Teamcity doc reference https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
 *
 * Module dependencies.
 */
'use strict';

const util = require('util');

const processPID = process.env['MOCHA_TEAMCITY_FLOWID'] || process.pid.toString();
const TEST_IGNORED = `##teamcity[testIgnored name='%s' message='%s' flowId='${processPID}']`;
const SUITE_START = `##teamcity[testSuiteStarted name='%s' flowId='${processPID}']`;
const SUITE_END = `##teamcity[testSuiteFinished name='%s' duration='%s' flowId='${processPID}']`;
const TEST_START = `##teamcity[testStarted name='%s' captureStandardOutput='true' flowId='${processPID}']`;
const TEST_FAILED = `##teamcity[testFailed name='%s' message='%s' details='%s' captureStandardOutput='true' flowId='${processPID}']`;
const TEST_END = `##teamcity[testFinished name='%s' duration='%s' flowId='${processPID}']`;
console.log(process.argv)
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
		.replace(/\x1B.*?m/g, '')
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

	})
	formattedArguments.unshift(tcMessage);
	return util.format.apply(util, formattedArguments) + '\n';
}


/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @param {options} options
 * @api public
 */

function Teamcity(runner) {
	Base.call(this, runner);
	let stats = this.stats;

	runner.on('suite', function (suite) {
		if (suite.root) return;
		suite.startDate = new Date();
		log(formatString(SUITE_START, suite.title));
	});

	runner.on('test', function (test) {
		log(formatString(TEST_START, test.title));
	});

	runner.on('fail', function (test, err) {
		log(formatString(TEST_FAILED, test.title, err.message, err.stack));
	});

	runner.on('pending', function (test) {
		log(formatString(TEST_IGNORED, test.title, test.title));
	});

	runner.on('test end', function (test) {
		log(formatString(TEST_END, test.title, test.duration));
	});

	runner.on('suite end', function (suite) {
		if (suite.root) return;
		log(formatString(SUITE_END, suite.title, new Date() - suite.startDate));
	});

	runner.on('end', function () {
		log(formatString(SUITE_END, 'mocha.suite', stats.duration));

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
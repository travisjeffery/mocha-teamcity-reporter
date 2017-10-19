'use strict';
const {execFile} = require('child_process');
const assert = require('assert');
const { logMochaOutput, getMochaPath } = require('./helpers');
const internalMochaPath = getMochaPath();

describe('Check TeamCity Output is correct with outer suite', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;
	function verifyResults() {
		it('stdout output should exist', function () {
			assert.ok(teamCityStdout, 'has output');
			assert.ok(teamCityOutputArray, 'array of output is populated');
			assert.ok(teamCityOutputArray.length >= 10, 'at least 10 lines of output');
		});

		it('stderr output should not exist', function () {
			assert.ok(teamCityStderr.length === 0);
		});

		it('Prefix suite start is present', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.ok(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.ok(/name='test-outer-suite-name'/.test(rowToCheck));
			assert.ok(/flowId=/.test(rowToCheck));
			assert.ok(/]/.test(rowToCheck));
		});

		it('Prefix suite end is present', function () {
			const rowToCheck = teamCityOutputArray[11];
			assert.ok(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.ok(/name='mocha.suite'/.test(rowToCheck));
			assert.ok(/duration=/.test(rowToCheck));
			assert.ok(/flowId=/.test(rowToCheck));
			assert.ok(/]/.test(rowToCheck));
		});

		it('Suite Root Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[11];
			assert.ok(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.ok(/name='mocha.suite'/.test(rowToCheck));
			assert.ok(/duration=/.test(rowToCheck));
			assert.ok(/flowId=/.test(rowToCheck));
			assert.ok(/]/.test(rowToCheck));
		});
	}

	describe('specified as an env var', function () {
		before(function (done) {
			const opts = {
				env: Object.assign({
					MOCHA_TEAMCITY_TOP_LEVEL_SUITE: 'test-outer-suite-name'
				}, process.env)
			};

			execFile(internalMochaPath, [
				'test/test_data',
				'--reporter',
				'lib/teamcity'
			], opts, (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityStderr = stderr;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});
		verifyResults();
	});

	describe('specified with --reporter-options', function () {
		before(function (done) {
			execFile(internalMochaPath, [
				'test/test_data',
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'topLevelSuite=test-outer-suite-name'
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityStderr = stderr;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});
		verifyResults();
	});

});

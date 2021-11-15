'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const {logMochaOutput, getMochaPath} = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

describe('Check TeamCity Output is correct with outer suite', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;

	function verifyResults() {
		it('stdout output should exist', function () {
			assert.isOk(teamCityStdout, 'has output');
			assert.isOk(teamCityOutputArray, 'array of output is populated');
			assert.isOk(teamCityOutputArray.length >= 9, 'at least 9 lines of output');
		});

		it('stderr output should not exist', function () {
			assert.isOk(teamCityStderr.length === 0);
		});

		it('Prefix suite start is present', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='test-outer-suite-name'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Prefix suite end is present', function () {
			const rowToCheck = teamCityOutputArray[9];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isNotOk(/name='mocha.suite'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Skip Test Finished is ignored', function () {
			const rowToCheck = teamCityOutputArray[7];
			assert.isOk(/##teamcity\[testIgnored/.test(rowToCheck));
			assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/message='Skipped Test @skip'/.test(rowToCheck));
			assert.isNotOk(/duration=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite Root Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[9];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isNotOk(/name='mocha.suite'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
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
				path.join('test', 'test_data', 'simple.js'),
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
				path.join('test', 'test_data', 'simple.js'),
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

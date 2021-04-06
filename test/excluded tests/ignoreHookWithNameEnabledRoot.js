'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

// Skipped because this suite should be run only for mocha 8 or higher
describe.skip('Check TeamCity Output is correct with ignoreHookWithName and root hooks option', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;
	function verifyResults() {
		it('stdout output should exist', function () {
			assert.isOk(teamCityStdout, 'has output');
			assert.isOk(teamCityOutputArray, 'array of output is populated');
			assert.lengthOf(teamCityOutputArray, 16);
			assert.isEmpty(teamCityOutputArray[15]);
		});

		it('stderr output should not exist', function () {
			assert.isEmpty(teamCityStderr);
		});


		it('stdout output should exist', function () {
			assert.isOk(teamCityStdout);
			assert.isOk(teamCityOutputArray);
			assert.isOk(teamCityOutputArray.length >= 12);
		});

		it('Suite1 started is OK', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Hook Test started is OK', function () {
			const rowToCheck = teamCityOutputArray[1];
			assert.match(rowToCheck, /##teamcity\[testStarted/);
			assert.match(rowToCheck, /name='"before all" hook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});

		it('Hook Test Failed is OK', function () {
			const rowToCheck = teamCityOutputArray[2];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/name='"before all" hook/.test(rowToCheck));
			assert.isOk(/details='/.test(rowToCheck));
			assert.isOk(/Error: Before hook error fail/.test(rowToCheck));
			assert.isOk(/|n/.test(rowToCheck));
			assert.isOk(/|failingHook.js:29:12/.test(rowToCheck));
			assert.isOk(/captureStandardOutput='true'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite1 Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[4];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite2 started is OK', function () {
			const rowToCheck = teamCityOutputArray[5];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});


		it('Test started is OK', function () {
			const rowToCheck = teamCityOutputArray[11];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});


		it('Passing Test Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[12];
			assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Test Failed is Failing', function () {
			const rowToCheck = teamCityOutputArray[8];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/name='Test Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/details='/.test(rowToCheck));
			assert.isOk(/AssertionError/.test(rowToCheck));
			assert.isOk(/|n/.test(rowToCheck));
			assert.isOk(/|failingHook.js:29:12/.test(rowToCheck));
			assert.isOk(/captureStandardOutput='true'/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Failing Test Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[9];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='Test Failing Test @fail'/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('Suite2 Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[14];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite Root Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[14];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isNotOk(/name='mocha.suite'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('After hook failed test is OK', function () {
			const rowToCheck = teamCityOutputArray[3];
			assert.match(rowToCheck, /##teamcity\[testFailed/);
			assert.match(rowToCheck, /"after all" hook: afterHookNoReporting for/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});

		it('After each root hook for failed test is OK', function () {
			const rowToCheck = teamCityOutputArray[10];
			assert.match(rowToCheck, /##teamcity\[testStarted/);
			assert.match(rowToCheck, /"after each" hook: afterEachRoot for "Test Failing Test/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});

		it('After each root hook for passed test is OK', function () {
			const rowToCheck = teamCityOutputArray[13];
			assert.match(rowToCheck, /##teamcity\[testStarted/);
			assert.match(rowToCheck, /"after each" hook: afterEachRoot for "Test Passing Test/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});
	}

	describe('specified as an env var', function () {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['RECORD_HOOK_FAILURES']: 'true',
					['IGNORE_HOOK_WITH_NAME']: 'HookNoReporting'
				}, process.env)
			};

			execFile(internalMochaPath, [
				path.join('test', 'example', 'failingIgnoreHook.js'),
				'--reporter',
				'lib/teamcity',
				`--require=${path.join('test', 'example', 'rootHooks.js')}`
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
				path.join('test', 'example', 'failingIgnoreHook.js'),
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'recordHookFailures=true',
				'--reporter-options',
				'ignoreHookWithName=HookNoReporting',
				`--require=${path.join('test', 'example', 'rootHooks.js')}`
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

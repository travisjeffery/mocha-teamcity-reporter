'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

describe('Check TeamCity Output is correct with recordHookFailures option disabled', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;
	function verifyResults() {
		it('1 stdout output should exist', function () {
			assert.isOk(teamCityStdout, 'has output');
			assert.isOk(teamCityOutputArray, 'array of output is populated');
			assert.lengthOf(teamCityOutputArray, 11);
			assert.isEmpty(teamCityOutputArray[10]);
		});

		it('2 stderr output should not exist', function () {
			assert.isEmpty(teamCityStderr);
		});

		it('3 testSuiteStarted for Suite1', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('4 testFailed for before all hook', function () {
			const rowToCheck = teamCityOutputArray[1];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/name='"before all" hook/.test(rowToCheck));
			assert.isOk(/details='/.test(rowToCheck));
			assert.isOk(/Error: Before hook error fail/.test(rowToCheck));
			assert.isOk(/|n/.test(rowToCheck));
			assert.isOk(/|failingHook.js:29:12/.test(rowToCheck));
			assert.isOk(/captureStandardOutput='true'/.test(rowToCheck));
			assert.match(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('5 testSuiteFinished for Suite1', function () {
			const rowToCheck = teamCityOutputArray[2];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('6 testSuiteStarted for Suite2', function () {
			const rowToCheck = teamCityOutputArray[3];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('7 testStarted for Failing Test', function () {
			const rowToCheck = teamCityOutputArray[4];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('8 testFailed for Failing Test', function () {
			const rowToCheck = teamCityOutputArray[5];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/name='Test Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/details='/.test(rowToCheck));
			assert.isOk(/AssertionError/.test(rowToCheck));
			assert.isOk(/|n/.test(rowToCheck));
			assert.isOk(/|failingHook.js:29:12/.test(rowToCheck));
			assert.isOk(/captureStandardOutput='true'/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('9 testFinished for Failing Test', function () {
			const rowToCheck = teamCityOutputArray[6];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='Test Failing Test @fail'/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('10 testStarted for Passing Test', function () {
			const rowToCheck = teamCityOutputArray[7];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});


		it('11 testFinished for Passing Test', function () {
			const rowToCheck = teamCityOutputArray[8];
			assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('12 testSuiteFinished for Suite2', function () {
			const rowToCheck = teamCityOutputArray[9];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.notMatch(rowToCheck, /flowId=.*_hook/);
			assert.isOk(/]/.test(rowToCheck));
		});
	}

	describe('specified as an env var', function () {
		before(function (done) {
			const opts = {};

			execFile(internalMochaPath, [
				'test/example/failingHook.js',
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
				path.join('test', 'example', 'failingHook.js'),
				'--reporter',
				'lib/teamcity'
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

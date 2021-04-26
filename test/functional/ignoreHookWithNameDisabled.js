'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

describe('Check TeamCity Output is correct with recordHookFailures but with no ignoreHookWithName option', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;
	function verifyResults() {
		it('1 stdout output should exist', function () {
			assert.isOk(teamCityStdout, 'has output');
			assert.isOk(teamCityOutputArray, 'array of output is populated');
			assert.lengthOf(teamCityOutputArray, 34);
			assert.isEmpty(teamCityOutputArray[33]);
		});

		it('2 stderr output should not exist', function () {
			assert.isEmpty(teamCityStderr);
		});

		it('3 Suite1 testSuiteStarted', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('4 Before all testStarted', function () {
			const rowToCheck = teamCityOutputArray[1];
			assert.match(rowToCheck, /##teamcity\[testStarted/);
			assert.match(rowToCheck, /name='"before all" hook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});

		it('5 Before all testFinished', function () {
			const rowToCheck = teamCityOutputArray[2];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"before all" hook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('6 Passing test testStarted', function () {
			const rowToCheck = teamCityOutputArray[3];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('7 Before each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[4];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"before each" hook: undefinedbeforeEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('8 Before each hook testFailed', function () {
			const rowToCheck = teamCityOutputArray[5];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/"before each" hook: undefinedbeforeEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/message='Before each hook error fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('9 Before all testFinished', function () {
			const rowToCheck = teamCityOutputArray[6];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /"before each" hook: undefinedbeforeEachHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('8 After each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[7];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/"after each" hook: undefinedafterEachHook/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('9 After each hook testFailed', function () {
			const rowToCheck = teamCityOutputArray[8];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/"after each" hook: undefinedafterEachHook for "Test Passing Test @pass"'/.test(rowToCheck));
			assert.isOk(/message='After each hook error fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('10 After each hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[9];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /"after each" hook: undefinedafterEachHook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('11 After hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[10];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"after all" hook/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('12 After hook testFailed', function () {
			const rowToCheck = teamCityOutputArray[11];
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/"after all" hook: afterHookNoReporting for "Test Passing Test @pass"/.test(rowToCheck));
			assert.isOk(/message='After hook error fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('13 After hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[12];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /"after all" hook: afterHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('14 Suite1 testSuiteFinished', function () {
			const rowToCheck = teamCityOutputArray[13];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Fail'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('15 Suite2 testSuiteStarted', function () {
			const rowToCheck = teamCityOutputArray[14];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('16 Before hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[15];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"before all" hook/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('17 Before hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[16];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"before all" hook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('18 Failing test testStarted', function () {
			const rowToCheck = teamCityOutputArray[17];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('19 Before each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[18];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"before each" hook: beforeEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('20 Before each hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[19];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"before each" hook: beforeEachHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('21 Failing test testFailed', function () {
			const rowToCheck = teamCityOutputArray[20];
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

		it('22 Failing Test testFinished', function () {
			const rowToCheck = teamCityOutputArray[21];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='Test Failing Test @fail'/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('23 After each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[22];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"after each" hook: afterEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('24 After each hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[23];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"after each" hook: afterEachHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('25 Passing test testStarted', function () {
			const rowToCheck = teamCityOutputArray[24];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('26 Before each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[25];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"before each" hook: beforeEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('27 Before each hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[26];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /"before each" hook: beforeEachHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('28 Passing test testFinished', function () {
			const rowToCheck = teamCityOutputArray[27];
			assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
			assert.isOk(/name='Test Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('29 After each hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[28];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"after each" hook: afterEachHookNoReporting/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('30 After each hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[29];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"after each" hook: afterEachHookNoReporting/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('31 After hook testStarted', function () {
			const rowToCheck = teamCityOutputArray[30];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='"after all" hook: afterHook/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('32 After hook testFinished', function () {
			const rowToCheck = teamCityOutputArray[31];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='"after all" hook: afterHook/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('33 Suite2 Finished', function () {
			const rowToCheck = teamCityOutputArray[32];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Hook Test Top Describe Pass'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});
	}

	describe('specified as an env var', function () {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['RECORD_HOOK_FAILURES']: 'true'
				}, process.env)
			};

			execFile(internalMochaPath, [
				path.join('test', 'example', 'failingIgnoreHookNoRoot.js'),
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
				path.join('test', 'example', 'failingIgnoreHookNoRoot.js'),
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'recordHookFailures=true'
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

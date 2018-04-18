'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

describe('Check TeamCity Output is correct with stdError option', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray, teamCityErrorOutputArray;
	function verifyResults() {
		it('stdout output should exist', function () {
			assert.isOk(teamCityStdout, 'has output');
			assert.isOk(teamCityOutputArray, 'array of output is populated');
			assert.isOk(teamCityOutputArray.length >= 10, 'at least 10 lines of output');
			assert.lengthOf(teamCityOutputArray, 10);
		});

		it('stderr output should exist', function () {
			assert.isOk(teamCityStderr);
			assert.isAbove(teamCityStderr.length, 15);
			assert.lengthOf(teamCityErrorOutputArray, 2);
		});


		it('stdout output should exist', function () {
			assert.isOk(teamCityStdout);
			assert.isOk(teamCityOutputArray);
			assert.isOk(teamCityOutputArray.length >= 10);
		});

		it('Suite started is OK', function () {
			const rowToCheck = teamCityOutputArray[0];
			assert.isOk(/##teamcity\[testSuiteStarted/.test(rowToCheck));
			assert.isOk(/name='Top Describe'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Test started is OK', function () {
			const rowToCheck = teamCityOutputArray[1];
			assert.match(rowToCheck, /##teamcity\[testStarted/);
			assert.match(rowToCheck, /name='Passing Test @pass'/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /]/);
		});

		it('Passing Test Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[2];
			assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
			assert.isOk(/name='Passing Test @pass'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Test Failed Started is OK', function () {
			const rowToCheck = teamCityOutputArray[3];
			assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
			assert.isOk(/name='Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Test Failed is Failing', function () {
			const rowToCheck = teamCityErrorOutputArray;
			assert.isOk(/##teamcity\[testFailed/.test(rowToCheck));
			assert.isOk(/name='Failing Test @fail'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/details='/.test(rowToCheck));
			assert.isOk(/AssertionError/.test(rowToCheck));
			assert.isOk(/|n/.test(rowToCheck));
			assert.isOk(/|simple.js:11:11/.test(rowToCheck));
			assert.isOk(/captureStandardOutput='true'/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Failing Test Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[4];
			assert.match(rowToCheck, /##teamcity\[testFinished/);
			assert.match(rowToCheck, /name='Failing Test @fail'/);
			assert.match(rowToCheck, /flowId=/);
			assert.match(rowToCheck, /duration=/);
			assert.match(rowToCheck, /]/);
		});

		it('Skip Test Finished is ignored', function () {
			const rowToCheck = teamCityOutputArray[5];
			assert.isOk(/##teamcity\[testIgnored/.test(rowToCheck));
			assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/message='Skipped Test @skip'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck) === false);
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Skip Test Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[6];
			assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
			assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[7];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='Top Describe'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});

		it('Suite Root Finished is OK', function () {
			const rowToCheck = teamCityOutputArray[8];
			assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
			assert.isOk(/name='mocha.suite'/.test(rowToCheck));
			assert.isOk(/duration=/.test(rowToCheck));
			assert.isOk(/flowId=/.test(rowToCheck));
			assert.isOk(/]/.test(rowToCheck));
		});
	}

	describe('specified as an env var', function () {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['USE_STD_ERROR']: 'true'
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
				teamCityErrorOutputArray = stderr.split('\n');
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
				'useStdError=true'
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityStderr = stderr;
				teamCityOutputArray = stdout.split('\n');
				teamCityErrorOutputArray = stderr.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});
		verifyResults();
	});

});

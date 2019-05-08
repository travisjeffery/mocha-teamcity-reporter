/**
 * Created by jamie on 12/08/2017.
 * Must be run from the root project dir
 */
'use strict';

const {execFile} = require('child_process');
const {assert} = require('chai');
const path = require('path');

const { logMochaOutput, getMochaPath } = require('../testHelpers');

const internalMochaPath = getMochaPath();

describe('Check TeamCity Output is correct', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;

	before(function (done) {
		execFile(internalMochaPath, [path.join('test', 'test_data', 'simple.js'), '--reporter', 'lib/teamcity'], (err, stdout, stderr) => {
			teamCityStdout = stdout;
			teamCityStderr = stderr;
			teamCityOutputArray = stdout.split('\n');
			logMochaOutput(stdout, stderr);
			done();
		});
	});

	it('Output should exist', function () {
		assert.isOk(teamCityStdout);
		assert.isOk(teamCityOutputArray);
		assert.isOk(teamCityStderr.length === 0);
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
		assert.isOk(/##teamcity\[testStarted/.test(rowToCheck));
		assert.isOk(/name='Passing Test @pass'/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isOk(/]/.test(rowToCheck));
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
		const rowToCheck = teamCityOutputArray[4];
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
		const rowToCheck = teamCityOutputArray[5];
		assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
		assert.isOk(/name='Failing Test @fail'/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isOk(/duration=/.test(rowToCheck));
		assert.isOk(/]/.test(rowToCheck));
	});

	it('Skip Test Finished is ignored', function () {
		const rowToCheck = teamCityOutputArray[6];
		assert.isOk(/##teamcity\[testIgnored/.test(rowToCheck));
		assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isOk(/message='Skipped Test @skip'/.test(rowToCheck));
		assert.isOk(/duration=/.test(rowToCheck) === false);
		assert.isOk(/]/.test(rowToCheck));
	});

	it('Skip Test Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[7];
		assert.isOk(/##teamcity\[testFinished/.test(rowToCheck));
		assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isNotOk(/duration=/.test(rowToCheck));
		assert.isOk(/]/.test(rowToCheck));
	});

	it('Suite Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[8];
		assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
		assert.isOk(/name='Top Describe'/.test(rowToCheck));
		assert.isOk(/duration=/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isOk(/]/.test(rowToCheck));
	});

	it('Suite Root Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[8];
		assert.isEmpty(teamCityOutputArray[9], 'Last row should be empty');
		assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
		assert.isNotOk(/name='mocha.suite'/.test(rowToCheck));
		assert.isOk(/duration=/.test(rowToCheck));
		assert.isOk(/flowId=/.test(rowToCheck));
		assert.isOk(/]/.test(rowToCheck));
	});

});

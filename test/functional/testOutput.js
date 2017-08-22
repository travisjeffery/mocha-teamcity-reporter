/**
 * Created by jamie on 12/08/2017.
 * Must be run from the root project dir
 */
'use strict';
const {execFile} = require('child_process');
const assert = require('assert');
const os = require('os');
const path = require('path');

let internalMochaPath;
if (os.platform() === 'win32') {
	internalMochaPath = path.resolve('node_modules', '.bin', 'mocha.cmd');
} else {
	internalMochaPath = path.resolve('node_modules', '.bin', 'mocha');
}

describe('Check TeamCity Output is correct', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;

	before(function (done) {
		execFile(internalMochaPath, ['test/test_data', '--reporter', 'lib/teamcity'], (err, stdout, stderr) => {
			teamCityStdout = stdout;
			teamCityStderr = stderr;
			teamCityOutputArray = stdout.split('\n');
			console.log('Observed Reporter Output');
			console.log('|#####################|');
			console.log(stdout);
			console.log('|#####################|');
			done();
		});
	});

	it('Output should exist', function () {
		assert.ok(teamCityStdout);
		assert.ok(teamCityOutputArray);
		assert.ok(teamCityStderr.length === 0);
		assert.ok(teamCityOutputArray.length >= 10);
	});

	it('Suite started is OK', function () {
		const rowToCheck = teamCityOutputArray[0];
		assert.ok(/##teamcity\[testSuiteStarted/.test(rowToCheck));
		assert.ok(/name='Top Describe'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Test started is OK', function () {
		const rowToCheck = teamCityOutputArray[1];
		assert.ok(/##teamcity\[testStarted/.test(rowToCheck));
		assert.ok(/name='Passing Test @pass'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Passing Test Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[2];
		assert.ok(/##teamcity\[testFinished/.test(rowToCheck));
		assert.ok(/name='Passing Test @pass'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Test Failed Started is OK', function () {
		const rowToCheck = teamCityOutputArray[3];
		assert.ok(/##teamcity\[testStarted/.test(rowToCheck));
		assert.ok(/name='Failing Test @fail'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck) === false);
		assert.ok(/]/.test(rowToCheck));
	});

	it('Test Failed is Failing', function () {
		const rowToCheck = teamCityOutputArray[4];
		assert.ok(/##teamcity\[testFailed/.test(rowToCheck));
		assert.ok(/name='Failing Test @fail'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck) === false);
		assert.ok(/details='/.test(rowToCheck));
		assert.ok(/AssertionError/.test(rowToCheck));
		assert.ok(/|n/.test(rowToCheck));
		assert.ok(/|simple.js:11:11/.test(rowToCheck));
		assert.ok(/captureStandardOutput='true'/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Failing Test Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[5];
		assert.ok(/##teamcity\[testFinished/.test(rowToCheck));
		assert.ok(/name='Failing Test @fail'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Skip Test Finished is ignored', function () {
		const rowToCheck = teamCityOutputArray[6];
		assert.ok(/##teamcity\[testIgnored/.test(rowToCheck));
		assert.ok(/name='Skipped Test @skip'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/message='Skipped Test @skip'/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck) === false);
		assert.ok(/]/.test(rowToCheck));
	});

	it('Skip Test Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[7];
		assert.ok(/##teamcity\[testFinished/.test(rowToCheck));
		assert.ok(/name='Skipped Test @skip'/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Suite Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[8];
		assert.ok(/##teamcity\[testSuiteFinished/.test(rowToCheck));
		assert.ok(/name='Top Describe'/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

	it('Suite Root Finished is OK', function () {
		const rowToCheck = teamCityOutputArray[9];
		assert.ok(/##teamcity\[testSuiteFinished/.test(rowToCheck));
		assert.ok(/name='mocha.suite'/.test(rowToCheck));
		assert.ok(/duration=/.test(rowToCheck));
		assert.ok(/flowId=/.test(rowToCheck));
		assert.ok(/]/.test(rowToCheck));
	});

});
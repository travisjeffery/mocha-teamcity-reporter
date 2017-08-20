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
			console.log(stdout);
			teamCityStdout = stdout;
			teamCityStderr = stderr;
			teamCityOutputArray = stdout.split('\n');
			console.log(teamCityOutputArray);
			done();
		});
	});

	it('Output should exist', function () {
		assert.ok(teamCityStdout);
		assert.ok(teamCityOutputArray);
		assert.ok(teamCityStderr.length === 0);
	});

	it('Suite started is OK', function () {
		const SuiteStartedRow = teamCityOutputArray[0];
		assert.ok(/##teamcity\[testSuiteStarted/.test(SuiteStartedRow));
		assert.ok(/name='Top Describe'/.test(SuiteStartedRow));
		assert.ok(/flowId=/.test(SuiteStartedRow));
		assert.ok(/]/.test(SuiteStartedRow));
	});
});
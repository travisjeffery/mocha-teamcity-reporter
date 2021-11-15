'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();
const path = require('path');

describe('Check TeamCity Output is correct with displayIgnoredAsIgnored option', function () {
	let teamCityStdout, teamCityStderr, teamCityOutputArray;
	function verifyResults(displayIgnoredAsIgnored) {
    it('Output should exist', function () {
      assert.isOk(teamCityStdout);
      assert.isOk(teamCityOutputArray);
      assert.isOk(teamCityStderr.length === 0);
      assert.isOk(teamCityOutputArray.length >= 9);

      if (displayIgnoredAsIgnored) {
        assert.isOk(teamCityOutputArray.length === 9);
      } else {
        assert.isOk(teamCityOutputArray.length === 10);
      }
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
      const report = teamCityOutputArray.join('\n');

      assert.isOk(/##teamcity\[testIgnored/.test(rowToCheck));
      assert.isOk(/name='Skipped Test @skip'/.test(rowToCheck));
      assert.isOk(/flowId=/.test(rowToCheck));
      assert.isOk(/message='Skipped Test @skip'/.test(rowToCheck));
      assert.isOk(/duration=/.test(rowToCheck) === false);
      assert.isOk(/]/.test(rowToCheck));

      if (displayIgnoredAsIgnored) {
        assert.isOk(new RegExp("##teamcity\\[testIgnored name='Skipped Test @skip' message='Skipped Test @skip' flowId='\\d+']").test(report), 'testIgnored');
        assert.isNotOk(new RegExp("##teamcity\\[testFinished name='Skipped Test @skip'").test(report), 'testFinished');
      } else {
        assert.isOk(new RegExp("##teamcity\\[testIgnored name='Skipped Test @skip' message='Skipped Test @skip' flowId='\\d+']").test(report), 'testIgnored');
        assert.isOk(new RegExp("##teamcity\\[testFinished name='Skipped Test @skip'").test(report), 'testFinished');
      }
    });

    it('Skip Test Finished is OK', function () {
      const report = teamCityOutputArray.join('\n');
      if (displayIgnoredAsIgnored) {
        assert.isNotOk(/##teamcity\[testFinished name='Skipped Test @skip/.test(report));
      } else {
        assert.isOk(/##teamcity\[testFinished name='Skipped Test @skip/.test(report));
      }
    });

    it('Suite Finished is OK', function () {
        const rowToCheck = displayIgnoredAsIgnored ? teamCityOutputArray[7] : teamCityOutputArray[8];
        assert.isOk(/##teamcity\[testSuiteFinished/.test(rowToCheck));
        assert.isOk(/name='Top Describe'/.test(rowToCheck));
        assert.isOk(/duration=/.test(rowToCheck));
        assert.isOk(/flowId=/.test(rowToCheck));
        assert.isOk(/]/.test(rowToCheck));
    });

    it('Suite Root Finished is OK', function () {
        const rowToCheck = displayIgnoredAsIgnored ? teamCityOutputArray[7] : teamCityOutputArray[8];
      if (displayIgnoredAsIgnored) {
        assert.isEmpty(teamCityOutputArray[8], 'Last row should be empty');
      } else {
        assert.isEmpty(teamCityOutputArray[9], 'Last row should be empty');
      }
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
					['DISPLAY_IGNORED_AS_IGNORED']: 'true'
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
		verifyResults(true);
	});

	describe('specified with --reporter-options', function () {
		before(function (done) {
			execFile(internalMochaPath, [
				path.join('test', 'test_data', 'simple.js'),
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'displayIgnoredAsIgnored=true'
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityStderr = stderr;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});
		verifyResults(true);
	});

	describe('specified as an env var as false', function () {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['DISPLAY_IGNORED_AS_IGNORED']: 'false'
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
		verifyResults(false);
	});

	describe('specified with --reporter-options as false', function () {
		before(function (done) {
			execFile(internalMochaPath, [
				path.join('test', 'test_data', 'simple.js'),
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'displayIgnoredAsIgnored=false'
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityStderr = stderr;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});
		verifyResults(false);
	});

});

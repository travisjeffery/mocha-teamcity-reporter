/* eslint-disable max-len */
'use strict';
const {execFile} = require('child_process');
const {assert} = require('chai');
const { logMochaOutput, getMochaPath } = require('../testHelpers');
const internalMochaPath = getMochaPath();

describe('Display Failed Hook As Failed Test - On', () => {
	let teamCityStdout, teamCityOutputArray;

  function verifyResults() {
    it('displays failed hook as failed test', () => {
			`
			teamcity[testSuiteStarted name='Before each hook Failure'
			##teamcity[testIgnored name='should _-$@#^&*be hello' message='should _-$@#^&*be hello' 
			##teamcity[testStarted name='"before each" hook for "should _-$@#^&*be hello"' captureStandardOutput='true'
			##teamcity[testFailed name='"before each" hook for "should _-$@#^&*be hello"'
			##teamcity[testFinished name='"before each" hook for "should _-$@#^&*be hello"'
			##teamcity[testSuiteFinished name='Before each hook Failure'
			`.split('\n').forEach((message) => {
				if (message === '') return;
				assert.isOk(teamCityStdout.includes(message.trim()), `${message}, \n\n${teamCityStdout}`);
			});
			
		});

		it('before each hook fail is in correct format', () => {
			assert.isOk(/^##teamcity\[testSuiteStarted name='Before each hook Failure'/.test(teamCityOutputArray[0]));
			assert.isOk(/^##teamcity\[testIgnored name='should _-\$@#\^&\*be hello' message='should _-\$@#\^&\*be hello'/.test(teamCityOutputArray[1]));
			assert.isOk(/^##teamcity\[testStarted name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[2]));
			assert.isOk(/^##teamcity\[testFailed name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[3]));
			assert.isOk(/^##teamcity\[testFinished name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[4]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='Before each hook Failure'/.test(teamCityOutputArray[5]));
    });

		it('after each hook fail is in correct format', () => {
			assert.isOk(/^##teamcity\[testSuiteStarted name='After each hook Failure'/.test(teamCityOutputArray[6]));
			assert.isOk(/^##teamcity\[testStarted name='should _-\$@#\^&\*be hello'/.test(teamCityOutputArray[7]));
			assert.isOk(/^##teamcity\[testFinished name='should _-\$@#\^&\*be hello'/.test(teamCityOutputArray[8]));
			assert.isOk(/^##teamcity\[testStarted name='"after each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[9]));
			assert.isOk(/^##teamcity\[testFailed name='"after each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[10]));
			assert.isOk(/^##teamcity\[testFinished name='"after each" hook for "should _-\$@#\^&\*be hello"'/.test(teamCityOutputArray[11]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='After each hook Failure'/.test(teamCityOutputArray[12]));
		});

		it('before each flaky hook failure is in correct format', () => {
			assert.isOk(/^##teamcity\[testSuiteStarted name='Before each flaky hook failure'/.test(teamCityOutputArray[13]));
			assert.isOk(/^##teamcity\[testStarted name='shows as passed'/.test(teamCityOutputArray[14]));
			assert.isOk(/^##teamcity\[testFinished name='shows as passed'/.test(teamCityOutputArray[15]));
			assert.isOk(/^##teamcity\[testIgnored name='this one doesnt run'/.test(teamCityOutputArray[16]));
			assert.isOk(/^##teamcity\[testStarted name='"before each" hook for "this one doesnt run"'/.test(teamCityOutputArray[17]));
			assert.isOk(/^##teamcity\[testFailed name='"before each" hook for "this one doesnt run"'/.test(teamCityOutputArray[18]));
			assert.isOk(/^##teamcity\[testFinished name='"before each" hook for "this one doesnt run"'/.test(teamCityOutputArray[19]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='Before each flaky hook failure'/.test(teamCityOutputArray[20]));
		});

		it('after each flaky hook failure is in correct format', () => {
			for (let i=21; i<=30; i++) {
				assert.isNotOk(/show as passed 2/.test(teamCityOutputArray[i]));
				assert.isNotOk(/doesnt run or show/.test(teamCityOutputArray[i]));
			}

			assert.isOk(/^##teamcity\[testSuiteStarted name='After each flaky hook failure'/.test(teamCityOutputArray[21]));
			assert.isOk(/^##teamcity\[testStarted name='shows as failed'/.test(teamCityOutputArray[22]));
			assert.isOk(/^##teamcity\[testFailed name='shows as failed'/.test(teamCityOutputArray[23]));
			assert.isOk(/^##teamcity\[testFinished name='shows as failed'/.test(teamCityOutputArray[24]));
			assert.isOk(/^##teamcity\[testStarted name='shows as passed'/.test(teamCityOutputArray[25]));
			assert.isOk(/^##teamcity\[testFinished name='shows as passed'/.test(teamCityOutputArray[26]));
			assert.isOk(/^##teamcity\[testStarted name='"after each" hook for "shows as passed"'/.test(teamCityOutputArray[27]));
			assert.isOk(/^##teamcity\[testFailed name='"after each" hook for "shows as passed"'/.test(teamCityOutputArray[28]));
			assert.isOk(/^##teamcity\[testFinished name='"after each" hook for "shows as passed"'/.test(teamCityOutputArray[29]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='After each flaky hook failure'/.test(teamCityOutputArray[30]));
		});

		it('nested describe tests', () => {
			assert.isOk(/^##teamcity\[testSuiteStarted name='Same name test'/.test(teamCityOutputArray[31]));

			assert.isOk(/^##teamcity\[testSuiteStarted name='hello'/.test(teamCityOutputArray[32]));
			assert.isOk(/^##teamcity\[testStarted name='hello test'/.test(teamCityOutputArray[33]));
			assert.isOk(/^##teamcity\[testFinished name='hello test'/.test(teamCityOutputArray[34]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='hello'/.test(teamCityOutputArray[35]));

			assert.isOk(/^##teamcity\[testSuiteStarted name='hello'/.test(teamCityOutputArray[36]));
				assert.isOk(/^##teamcity\[testStarted name='hello it test'/.test(teamCityOutputArray[37]));
				assert.isOk(/^##teamcity\[testFinished name='hello it test'/.test(teamCityOutputArray[38]));
				assert.isOk(/^##teamcity\[testStarted name='hello B'/.test(teamCityOutputArray[39]));
				assert.isOk(/^##teamcity\[testFailed name='hello B'/.test(teamCityOutputArray[40]));
				assert.isOk(/^##teamcity\[testFinished name='hello B'/.test(teamCityOutputArray[41]));

				assert.isOk(/^##teamcity\[testSuiteStarted name='hello'/.test(teamCityOutputArray[42]));
				assert.isOk(/^##teamcity\[testStarted name='hello b'/.test(teamCityOutputArray[43]));
				assert.isOk(/^##teamcity\[testFinished name='hello b'/.test(teamCityOutputArray[44]));
				assert.isOk(/^##teamcity\[testIgnored name='silent'/.test(teamCityOutputArray[45]));
				assert.isOk(/^##teamcity\[testSuiteFinished name='hello'/.test(teamCityOutputArray[46]));

				assert.isOk(/^##teamcity\[testSuiteStarted name='hello'/.test(teamCityOutputArray[47]));
				assert.isOk(/^##teamcity\[testIgnored name='this case never runs'/.test(teamCityOutputArray[48]));
				assert.isOk(/^##teamcity\[testStarted name='"before each" hook for "this case never runs"'/.test(teamCityOutputArray[49]));
				assert.isOk(/^##teamcity\[testFailed name='"before each" hook for "this case never runs"'/.test(teamCityOutputArray[50]));
				assert.isOk(/^##teamcity\[testFinished name='"before each" hook for "this case never runs"'/.test(teamCityOutputArray[51]));
				assert.isOk(/^##teamcity\[testSuiteFinished name='hello'/.test(teamCityOutputArray[52]));
			assert.isOk(/^##teamcity\[testSuiteFinished name='hello'/.test(teamCityOutputArray[53]));

			assert.isOk(/^##teamcity\[testSuiteFinished name='Same name test'/.test(teamCityOutputArray[54]));
		});
  }

  describe('Display Failed Hook As Failed Test - environment variables - On', () => {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['RECORD_HOOK_FAILURES']: 'true',
					['DISPLAY_IGNORED_AS_IGNORED']: 'true',
					['DISPLAY_FAILED_HOOK_AS_FAILED_TEST']: 'true',
				}, process.env)
			};

			execFile(internalMochaPath, [
				'test/example/beforeHookFailures.js',
				'--reporter',
				'lib/teamcity'
			], opts, (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});

		verifyResults();
  });

  describe('Display Failed Hook As Failed Test with --reporter-options - On', () => {
		before(function (done) {
			execFile(internalMochaPath, [
				'test/example/beforeHookFailures.js',
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'"recordHookFailures=true,displayIgnoredAsIgnored=true,displayFailedHookAsFailedTest=true"',
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});

		verifyResults();
  });

	function verifyOffResults() {
    // ##teamcity[testSuiteStarted name='Before each hook Failure' flowId='14719']
    // ##teamcity[testStarted name='should _-$@#^&*be hello' captureStandardOutput='true' flowId='14719']
    // ##teamcity[testStarted name='"before each" hook for "should _-$@#^&*be hello"' captureStandardOutput='true' flowId='14719_hook']
    // ##teamcity[testFailed name='"before each" hook for "should _-$@#^&*be hello"' message='Errrr! Something went wrong.' details='Error: Errrr! Something went wrong.|n    at Context.<anonymous> (test/example/beforeHookFailures.js:7:11)|n    at processImmediate (node:internal/timers:464:21)' captureStandardOutput='true' flowId='14719_hook']
    // ##teamcity[testFinished name='"before each" hook for "should _-$@#^&*be hello"' duration='0' flowId='14719_hook']
    // ##teamcity[testSuiteFinished name='Before each hook Failure' duration='2' flowId='14719']
    it('does not display failed hook as failed test', () => {
      assert.isOk(teamCityStdout, 'has output');
      assert.isOk(
        /testSuiteStarted name='Before each hook Failure'/.test(
          teamCityOutputArray[0]
        )
      );
      assert.isOk(
        /testStarted name='should _-\$@#\^&\*be hello'/.test(
          teamCityOutputArray[1]
        )
      );
      assert.isOk(
        /testStarted name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(
          teamCityOutputArray[2]
        )
      );
      assert.isOk(
        /testFailed name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(
          teamCityOutputArray[3]
        )
      );
			assert.isOk(/testFinished name='"before each" hook for "should _-\$@#\^&\*be hello"'/.test(
				teamCityOutputArray[4]
			));
			assert.isOk(/testSuiteFinished name='Before each hook Failure'/.test(
				teamCityOutputArray[5]
			));
    });
  }

  describe('Display Failed Hook As Failed Test - Off', () => {
		before(function (done) {
			const opts = {
				env: Object.assign({
					['RECORD_HOOK_FAILURES']: 'true',
					['DISPLAY_IGNORED_AS_IGNORED']: 'true',
					['DISPLAY_FAILED_HOOK_AS_FAILED_TEST']: 'false',
				}, process.env)
			};

			execFile(internalMochaPath, [
				'test/example/beforeHookFailures.js',
				'--reporter',
				'lib/teamcity'
			], opts, (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});

		verifyOffResults();
  });

  describe('Display Failed Hook As Failed Test with --reporter-options - Off', () => {
		before(function (done) {
			execFile(internalMochaPath, [
				'test/example/beforeHookFailures.js',
				'--reporter',
				'lib/teamcity',
				'--reporter-options',
				'recordHookFailures=true,displayIgnoredAsIgnored=true,displayFailedHookAsFailedTest=false'
			], (err, stdout, stderr) => {
				teamCityStdout = stdout;
				teamCityOutputArray = stdout.split('\n');
				logMochaOutput(stdout, stderr);
				done();
			});
		});

		verifyOffResults();
  });

});
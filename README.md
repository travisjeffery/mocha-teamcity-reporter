[![NPM version](https://badge.fury.io/js/mocha-teamcity-reporter.svg)](http://badge.fury.io/js/mocha-teamcity-reporter)
[![TeamCity Build Status](https://teamcity.jetbrains.com/guestAuth/app/rest/builds/buildType:(id:TeamCityThirdPartyPlugins_MochaTeamcityReporter_Build)/statusIcon.svg)](https://teamcity.jetbrains.com/viewType.html?buildTypeId=TeamCityThirdPartyPlugins_MochaTeamcityReporter_Build&branch_TeamCityThirdPartyPlugins_MochaTeamcityReporter=%3Cdefault%3E&tab=buildTypeStatusDiv)

# mocha-teamcity-reporter #

mocha-teamcity-reporter Teamcity reporter which makes it possible to display test results in real-time, makes test information
available on the Tests tab of the Build Results page.

## Version 4.x changes

* Breaking: Only supported on node.js 6 and above
* Breaking: Only Mocha version 6 and above is now supported
  * Please remain on `mocha-teamcity-reporter@3` if this is an issue

## Mocha@6 notes

* recordHookFailures option may not work as intended as mocha6 is now doing this itself

## Requirements

* NodeJs 4+
* Web Browser supporting ES5

## To Install

In your project run a npm install command:

``` npm install mocha-teamcity-reporter --save-dev ```

Basically, have your project's package.json be like:

``` js
{
  "devDependencies": {
    "mocha-teamcity-reporter": ">=2.0.0"
  }
}
```

## Usage

<https://github.com/visionmedia/mocha/wiki/Third-party-reporters> describes using third party reporters in mocha.

Then call mocha with:

`mocha --reporter mocha-teamcity-reporter test`

## Running In Browser

* Use `lib/teamcityBrowser`
* Has option parsing stripped out for the moment
* Example use can be found in `test\browser`
* Custom log function can be set with window.customLogFunction

## Customisation

### TeamCity flowId

Can set flowId like:
`mocha test --reporter mocha-teamcity-reporter --reporter-options flowId=gobbledygook`

### Top-level suite name

Can set a top-level suite name, which will wrap all other suites.  
This is useful for reading test output when running multiple suites in a single build

* Environment variable: MOCHA_TEAMCITY_TOP_LEVEL_SUITE=<suiteName>
* Reporter option: topLevelSuite=<suiteName>

### log test failures with std error

To enable this please
Please note this will probaly be made default in the next major version

* Environment variable: USE_STD_ERROR=true  
* Reporter option: useStdError=true

### Record hook failures

Record failures for hooks such as before/after etc
Please note this will probably be made default in the next major version

* Environment variable: RECORD_HOOK_FAILURES=true  
* Reporter option: recordHookFailures=true

### Ignore hooks with title contains some text

This option should be used in pair with recordHookFailures. It allows you to skip reporting of hooks containing some word. Including root hooks.

* Environment variable: IGNORE_HOOK_WITH_NAME=HookNoReporting  
* Reporter option: ignoreHookWithName=HookNoReporting

Example:
`mocha test --reporter mocha-teamcity-reporter --reporter-options recordHookFailures --reporter-options ignoreHookWithName=HookNoReporting`

For root hooks defined the following way:

```
exports.mochaHooks = () => {
 return {
  beforeEach: [
   function beforeEachRootHookNoReporting() {
    assert.strictEqual(1, 1);
   }
  ],
  afterEach: [
   function afterEachRoot() {
    assert.strictEqual(1, 1);
   },
  ]
 };
};
```

beforeEach hook beforeEachRootHookNoReporting() will not be reported as testStarted. But hook afterEachRoot() will be reported:

### Show diff between expected and actual values

This will allow a hyperlink to appear to compare actual vs expected
Please note this requires the error thrown in mocha to have the properties actual and expected. For example an assertionError has this

* Environment variable: ACTUAL_VS_EXPECTED=true  
* Reporter option: actualVsExpected=true

This will be shown in teamcity like this:

```
AssertionError [ERR_ASSERTION]: 2 == 1
     at Context.<anonymous> (test/test_data/simple.js:11:11)
 ======= Failed test run #10 ==========
 Show diff between expected and actual values
 ```

### Setting options

* Set with reporter-options:

`mocha test --reporter mocha-teamcity-reporter --reporter-options topLevelSuite=top-level-suite-name`
`mocha test --reporter mocha-teamcity-reporter --reporter-options useStdError=true`
`mocha test --reporter mocha-teamcity-reporter --reporter-options useStdError=true`

* Set with environment variable

`MOCHA_TEAMCITY_TOP_LEVEL_SUITE='top-level-suite-name' mocha test --reporter mocha-teamcity-reporter`

## View on live Teamcity

* Project can be viewed at
[Pubic Teamcity at Jetbrains mocha reporter](https://teamcity.jetbrains.com/project.html?projectId=TeamCityThirdPartyPlugins_MochaTeamcityReporter)
* Thanks to JetBrains for hosting

## Contributions

* Always Welcome
* Would prefer if customisation is added it is controlled via mocha options or environment variables
* Only requirement is for code to pass linting and functional tests

## Run example test in project

`mocha test/test_data/simple.js --reporter mocha-teamcity-reporter` or `npm run test-teamcity-example`

## Reference Information

<https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity>

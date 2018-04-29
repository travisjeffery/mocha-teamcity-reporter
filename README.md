[![NPM version](https://badge.fury.io/js/mocha-teamcity-reporter.svg)](http://badge.fury.io/js/mocha-teamcity-reporter)
[![Build Status](https://travis-ci.org/travisjeffery/mocha-teamcity-reporter.svg?branch=master)](https://travis-ci.org/travisjeffery/mocha-teamcity-reporter)

# mocha-teamcity-reporter #

mocha-teamcity-reporter Teamcity reporter which makes it possible to display test results in real-time, makes test information 
available on the Tests tab of the Build Results page.

## Version 2.x changes
* Breaking change, support node4.x+ only 
* Support flowId's
    * Why use flowIds? Flow tracking is necessary, for example, to distinguish separate processes running in parallel
    * This defaults to process.pid, so it works with concurrent task runners (Gulp/Grunt etc)
* other small bug fixes
* Functional tests

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

https://github.com/visionmedia/mocha/wiki/Third-party-reporters describes using third party reporters in mocha.

Then call mocha with:

`mocha --reporter mocha-teamcity-reporter test`

## Running In Browser
* Use `lib/teamcityBrowser`
* Has option parsing stripped out for the moment
* example use can be found in `test\browser`

## Customisation:

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

### Setting options

* Set with reporter-options:

`mocha test --reporter mocha-teamcity-reporter --reporter-options topLevelSuite=top-level-suite-name`
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

## Run example test in project:
`mocha test/test_data/simple.js --reporter mocha-teamcity-reporter` or `npm run test-teamcity-example`

## Reference Information
https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity

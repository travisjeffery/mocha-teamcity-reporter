# mocha-teamcity-reporter-v2 #

[![Build Status](https://travis-ci.org/jamie-sherriff/mocha-teamcity-reporter.svg?branch=master)](https://travis-ci.org/jamie-sherriff/mocha-teamcity-reporter)
[![Build status](https://ci.appveyor.com/api/projects/status/t6uenr1n9umcwew7?svg=true)](https://ci.appveyor.com/project/jamie-sherriff/mocha-teamcity-reporter)

mocha-teamcity-reporter-v2 Teamcity reporter which makes it possible to display test results in real-time, makes test information 
available on the Tests tab of the Build Results page.

Please note this has been forked from the original author https://github.com/travisjeffery/mocha-teamcity-reporter 
which does not appear to be maintained or accepting Pull requests. Also note this is not endorsed by the original creator

## Why use this over the original:
* Drop in replacement for the original mocha-teamcity-reporter
* Support flowId's
    * Why use flowIds? Flow tracking is necessary, for example, to distinguish separate processes running in parallel
    * This package defaults to process.pid, so it works with concurrent task runners (Gulp/Grunt etc)
* other small bug fixes
* Functional tests

## Requirements
* NodeJs 4+

## To Install

In your project run a npm install command:

``` npm install mocha-teamcity-reporter-v2 --save-dev ```

Basically, have your project's package.json be like:

``` js
{
  "devDependencies": {
    "mocha-teamcity-reporter-v2": ">=2.0.0"
  }
}
```

## Usage

https://github.com/visionmedia/mocha/wiki/Third-party-reporters describes using third party reporters in mocha.

Then call mocha with:

`mocha --reporter mocha-teamcity-reporter-v2 test`

## Customisation:

### TeamCity flowId

Can set flowId like:
`mocha test --reporter mocha-teamcity-reporter-v2 --reporter-options flowId=gobbledygook`

### Top-level suite name

Can set a top-level suite name, which will wrap all other suites.

This is useful for reading test output when running multiple suites in a single build:

* Set with reporter-options:

`mocha test --reporter mocha-teamcity-reporter-v2 --reporter-options topLevelSuite=top-level-suite-name`

* Set with environment variable

`MOCHA_TEAMCITY_TOP_LEVEL_SUITE='top-level-suite-name' mocha test --reporter mocha-teamcity-reporter-v2`

## Contributions
* Always Welcome
* Would prefer if customisation is added it is controlled via mocha options or environment variables
* Only requirement is for code to pass linting and functional tests

## Run example test in project:
`mocha test/test_data/simple.js --reporter mocha-teamcity-reporter-v2` or `test-teamcity-example`

## Reference Information
https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity

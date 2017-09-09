# mocha-teamcity-reporter-v2 #

[![Build Status](https://travis-ci.org/jamie-sherriff/mocha-teamcity-reporter.svg?branch=master)](https://travis-ci.org/jamie-sherriff/mocha-teamcity-reporter)
[![Build status](https://ci.appveyor.com/api/projects/status/t6uenr1n9umcwew7?svg=true)](https://ci.appveyor.com/project/jamie-sherriff/mocha-teamcity-reporter)

mocha-teamcity-reporter-v2 Teamcity reporter which makes it possible to display test results in real-time, makes test information 
available on the Tests tab of the Build Results page.

Please note this has been forked from the original author https://github.com/travisjeffery/mocha-teamcity-reporter 
which does not appear to be maintained or accepting Pull requests. Also note this is not endorsed by the original creator

## Why use this over the original:
* Support flowId's
    * Why use flowIds? Flow tracking is necessary, for example, to distinguish separate processes running in parallel
    * This package defaults to process.pid, so it works with concurrent task runners (Gulp/Grunt etc)
* other small bug fixes
* Functional tests

## Requirements
* NodeJs 4+

## Usage

https://github.com/visionmedia/mocha/wiki/Third-party-reporters describes using third party reporters in mocha.

Basically, have your project's package.json be like:

``` js
{
  "devDependencies": {
    "mocha-teamcity-reporter": ">=0.0.1"
  }
}
```

Then call mocha with:

`mocha --reporter mocha-teamcity-reporter test`

## Customisation:
Can set flowId like:  
`mocha test --reporter lib/teamcity --reporter-options flowId=gobbledygook`

## Contributions
* Always Welcome
* Would prefer if customisation is added it is controlled via mocha options or environment variables
* Only requirement is for code to pass linting and functional tests

## Run example test:
`mocha test/test_data/simple.js --reporter lib/teamcity` or `test-teamcity-example`

## Reference Information
https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity
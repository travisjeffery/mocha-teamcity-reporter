[![npm version](https://badge.fury.io/js/mocha-teamcity-reporter.svg)](http://badge.fury.io/js/mocha-teamcity-reporter)

mocha-teamcity-reporter-v2 Teamcity reporter which makes it possible to display test results in real-time, makes test information 
available on the Tests tab of the Build Results page.

Please note this has been forked from the orginal author https://github.com/travisjeffery/mocha-teamcity-reporter 
which does not appear to be maintained or accepting Pull requests. Also note this is not endorsed by the original creator

##Why use this over the original
* Support flowId's
* other small bug fixes (such as skipped tests get a duration)

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
`mocha test/test_data --reporter lib\teamcity --reporter-options flowId=gobbledygook`
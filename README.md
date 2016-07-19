[![npm version](https://badge.fury.io/js/mocha-teamcity-reporter.svg)](http://badge.fury.io/js/mocha-teamcity-reporter)

(Note: I'm looking to add someone as a collaborator/maintainer if you're interested let me know.)

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

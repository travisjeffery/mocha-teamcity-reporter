3.0.0 / 2019-01-21
==================
* Change mocha to peer dependency
* Support mocha version 6
* Breaking: focus on only support node.js environments (Please )
* Breaking: Remove phantomJs support only supports environments which have require
* Potential Breaking: Remove Redundant top level mocha.suite
* Drop the duration on messages if mocha returns undefined/null (for example skipped test) TeamCity will then use received timestamps to calculate duration
* Support Show diff between expected and actual values


TODO
comparisonFailure service message attributes

2.5.2 / 2019-01-21
==================
* Restrict mocha dependency to less than 6 due to compatibility issues

2.5.1 / 2018-09-27
==================
* Vuejs/Webpack compatibility, solves #45

2.5.0 / 2018-09-18
==================
* Add test in hook option, solves #35

2.4.0 / 2018-04-18
==================
* Add Browser Support back in by use of separate file, solves #41

2.3.0 / 2018-04-18
==================
* Add use stdError option solves #31

2.2.2 / 2018-02-27
==================
* Fix issue #39
* Add real teamcity tests

2.2.1 / 2018-02-06
==================
* Merge pull request #38 reporterOptions are optional from chge/master
* Add a test to catch above PR

2.2.0 / 2018-02-05 
==================
* Maintenance Update, Merged forked branch back into master branch by Travis
* Breaking change, supports node 4+ only 
* Support flowId's
    * Why use flowIds? Flow tracking is necessary, for example, to distinguish separate processes running in parallel
    * This defaults to process.pid, so it works with concurrent task runners (Gulp/Grunt etc)
* Other small bug fixes
* Functional tests

2.1.0 / 2017-10-19 
==================
* add top level suite option (@davidmfoley)

2.0.1 / 2017-08-22 
==================
* Bug Fixes

2.0.0 / 2017-08-20
==================
* Add FlowId
* Minimum nodejs engine of 4+
* Add some eslint magic

1.1.0 / 2016-08-24 
==================
  * Support running in the browser with Mocha without require.js

1.0.1 / 2016-07-18
==================
  * Remove escape sequences from reporting
  * Fix NaN duration

1.0.0 / 2015-09-30
==================
  * Merge pull request #14 from debitoor/master
  * add err.stack to details of error
  * Merge pull request #8 from bdefore/master
  * Update teamcity.js
  * Merge pull request #6 from pandell/mocha-phantomjs

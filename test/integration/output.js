/**
 * Created by jamie on 12/08/2017.
 */
'use strict';
const exec = require('child_process').exec;
const mochaPath = require.resolve('mocha');
exec(mochaPath, (err, stdout, stderr) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(stdout);
});
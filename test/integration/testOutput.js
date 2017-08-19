/**
 * Created by jamie on 12/08/2017.
 */
'use strict';
const {exec, execFile} = require('child_process');
const mochaPath = require.resolve('mocha');
const path = require('path');
console.log(process.cwd())
console.log(mochaPath)
//exec('mocha', [path.join('test','test_data'), {shell:true}], (err, stdout, stderr) => {
//const internalPath = path.resolve('./node_modules','.bin','mocha.cmd')
execFile(internalPath + ' test/test_data', {shell:true}, (err, stdout, stderr) => {
	if (err) {
		console.log(stdout);
		console.log(stderr);
		console.error(err);
	}

});
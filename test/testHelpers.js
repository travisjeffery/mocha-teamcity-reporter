'use strict';

const os = require('os');
const path = require('path');

function logMochaOutput(stdout, stderr) {
	console.log('Observed Reporter Output');
	console.log('|#####################|');
	console.log(stdout);
	console.log('|#####################|');

	if (stderr) {
		console.log('|#####################|');
		console.log('stderr:');
		console.log('|#####################|');
		console.log(stderr);
		console.log('|#####################|');
	}
}


function getMochaPath() {
	if (os.platform() === 'win32') {
		return path.resolve('node_modules', '.bin', 'mocha.cmd');
	} else {
		return path.resolve('node_modules', '.bin', 'mocha');
	}
}

function getTestDataPath(){
	return path.join('test', 'test_data');
}

module.exports = {
	logMochaOutput,
	getMochaPath,
	getTestDataPath
};

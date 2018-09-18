'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const  path = require('path');
const {getTestDataPath } = require('../testHelpers');
const testDataDir = getTestDataPath();

//Assumes running from root project dir
describe('Can use reporter programmatically', function () {
	let mocha;

	before(function () {
		// Instantiate a Mocha instance.
		mocha = new Mocha({
			reporter: path.join('lib', 'teamcity')
		});
		fs.readdirSync(testDataDir).filter(function (file){
			// Only keep the .js files
			return file.substr(-3) === '.js';
		}).forEach(function (file){
			mocha.addFile(
				path.join(testDataDir, file)
			);
		});
	});
		it('programmatic reporter can get to exit', function (done) {
			// Run the tests.
			const mochaRunner = mocha.run();
			mochaRunner.on('end', function () {
					done();
			});
		});
});
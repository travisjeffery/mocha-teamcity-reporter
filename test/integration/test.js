/**
 * Created by jamie on 19/08/2017.
 */
var Mocha = require('mocha'),
	fs = require('fs'),
	path = require('path');

// Instantiate a Mocha instance.
const reporterLocation = path.resolve('..','lib','teamcity.js');
console.log(reporterLocation)
let outStream = process.stdout;
var mocha = new Mocha({
	reporter: 'lib/teamcity',
	reporterOptions: {'k1':'v1'}
});

var testDir = path.resolve('test','test_data')

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
	// Only keep the .js files
	return file.substr(-3) === '.js';

}).forEach(function(file){
	mocha.addFile(
		path.join(testDir, file)
	);
});

function checkMochaOutput(eventName) {
	return new Promise((resolve, reject)=>{
		mocha.run(function(failures){
		}).on(eventName, function(output) {

		});
	})
}

//checkMochaOutput('message')

let runner = 		mocha.run();


//console.log(runner)

//
// // Run the tests.
// mocha.run(function(failures){
// }).on('test', function(test) {
// 	console.log('gobbly gook');
// });
// Source https://medium.com/dailyjs/running-mocha-tests-as-native-es6-modules-in-a-browser-882373f2ecb0
describe('sum', function () {
	it('should return sum of arguments fail', function () {
		chai.expect(1).to.equal(3);
	});

	it('should return sum of arguments pass', function () {
		chai.expect(1).to.equal(1);
	});

});
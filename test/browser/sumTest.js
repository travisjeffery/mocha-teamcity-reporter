/*global chai*/
/*eslint-env browser*/
/*eslint strict: ["error", "never"]*/


describe('sum', function () {
	it('should return sum of arguments fail', function () {
		chai.expect(1).to.equal(3);
	});

	it('should return sum of arguments pass', function () {
		chai.expect(1).to.equal(1);
	});

});
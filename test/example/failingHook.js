/**
 * Created by jamie on 12/08/2017.
 */
'use strict';
const assert = require('assert');
	describe('Example Test Top Describe', function () {

		before(function() {
			throw new Error('Before hook error fail')
		});

		it('Example Test  Passing Test @pass', function () {
			assert.equal(1, 1);
		});
		it('Example Test  Failing Test @fail', function () {
			assert.equal(2, 1);
		});
		it.skip('Example Test Skipped Test @skip', function () {
			assert.equal(2, 1);
		});
	});
		describe('Example Test Top Describe', function () {

			it('Example Test  Failing Test @fail', function () {
				assert.equal(2, 1);
			});

});
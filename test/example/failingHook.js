/**
 * Created by jamie on 12/08/2017.
 */
'use strict';
const assert = require('assert');
	describe('Hook Test Top Describe Fail', function () {

		before(function () {
			throw new Error('Before hook error fail');
		});

		it('Test Passing Test @pass', function () {
			assert.equal(1, 1);
		});
		it('Test Failing Test @fail', function () {
			assert.equal(2, 1);
		});
		it.skip(' Test Skipped Test @skip', function () {
			assert.equal(2, 1);
		});
	});
		describe('Hook Test Top Describe Pass', function () {

			before(function () {
				assert.equal(1, 1);
			});

			it('Test Failing Test @fail', function () {
				assert.equal(2, 1);
			});

			it('Test Passing Test @pass', function () {
				assert.equal(1, 1);
			});
});
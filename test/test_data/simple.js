/**
 * Created by jamie on 12/08/2017.
 */
'use strict';
const assert = require('assert');
	describe('Top Describe', function () {
		it('Passing Test @pass', function () {
			assert.equal(1, 1);
		});
		it('Failing Test @fail', function () {
			assert.equal(2, 1);
		});
		it.skip('Skipped Test @skip', function () {
			assert.equal(2, 1);
		});
});
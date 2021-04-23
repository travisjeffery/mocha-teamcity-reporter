/**
 * Created by dj-glock on 04/06/2021.
 */
'use strict';
const assert = require('assert');
	
describe('Hook Test Top Describe Fail', function () {
	before(function () {
		throw new Error('Before hook error fail');
	});

	it('Test Passing Test @pass', function () {
		assert.strictEqual(1, 1);
	});
	it('Test Failing Test @fail', function () {
		assert.strictEqual(2, 1);
	});
	it.skip(' Test Skipped Test @skip', function () {
		assert.strictEqual(2, 1);
	});

	after(function afterHookNoReporting() {
		throw new Error('After hook error fail');
	});
});

describe('Hook Test Top Describe Pass', function () {
	before(function () {
		assert.strictEqual(1, 1);
	});

	it('Test Failing Test @fail', function () {
		assert.strictEqual(2, 1);
	});

	it('Test Passing Test @pass', function () {
		assert.strictEqual(1, 1);
	});

	after(function afterHookNoReporting() {
		assert.strictEqual(1, 1);
	});
});
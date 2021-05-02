 /**
 * Created by dj-glock on 04/06/2021.
 */
'use strict';
const assert = require('assert');
	
describe('Hook Test Top Describe Fail', function () {
	before(function () {
		assert.strictEqual(1, 1);
	});

	// Name of the function is an additional check for case when ignoreHookWithName is undefined
	beforeEach(function undefinedbeforeEachHookNoReporting() {
		throw new Error('Before each hook error fail');
	});

	it('Test Passing Test @pass', function () {
		assert.strictEqual(1, 1);
	});

	// Name of the function is an additional check for case when ignoreHookWithName is undefined
	afterEach(function undefinedafterEachHook() {
		throw new Error('After each hook error fail');
	});

	after(function afterHookNoReporting() {
		throw new Error('After hook error fail');
	});
});

describe('Hook Test Top Describe Pass', function () {
	before(function () {
		assert.strictEqual(1, 1);
	});

	beforeEach(function beforeEachHookNoReporting() {
		assert.strictEqual(1, 1);
	});

	it('Test Failing Test @fail', function () {
		assert.strictEqual(2, 1);
	});

	it('Test Passing Test @pass', function () {
		assert.strictEqual(1, 1);
	});

	afterEach(function afterEachHookNoReporting() {
		assert.strictEqual(1, 1);
	});

	after(function afterHook() {
		assert.strictEqual(1, 1);
	});
});
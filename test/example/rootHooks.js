/**
 * Created by dj-glock on 04/06/2021.
 */
'use strict';
const assert = require('assert');

exports.mochaHooks = () => {
	return {
		beforeEach: [
			function beforeEachRootHookNoReporting() {
				assert.strictEqual(1, 1);
			}
		],
		afterEach: [
			function afterEachRoot() {
				assert.strictEqual(1, 1);
			},
		]
	};
};
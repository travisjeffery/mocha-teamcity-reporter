describe('something', function () {
	let stubA;

	before(function () {
		stubA = stubThingA();
		if (reasons()) {
			this.skip();
		}
	});

	describe('something else', function () {
		let stubB;

		before(function () {
			stubB = stubThingB();
		});

		after(function () {
			// this nested `after` does *all* of the teardown.
			stubA.restore();
			stubB.restore();
		});
	});

	// what the author should do instead is create an `after`
	// hook here, which calls `stubA.restore()`.
});
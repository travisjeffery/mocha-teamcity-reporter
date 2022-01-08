'use strict';
const assert = require('assert');
describe('Before each hook Failure', function () {
  beforeEach(() => {
    throw new Error('Errrr! Something went wrong.');
  });

  it('should _-$@#^&*be hello', () => {
    assert.equal(1, 1);
  });
});

describe('After each hook Failure', function () {
  afterEach(() => {
    throw new Error('Errrr! Something went wrong.');
  });

  it('should _-$@#^&*be hello', () => {
    assert.equal(1, 1);
  });
});

describe('Before each flaky hook failure', function () {
  let counter = 2;

  beforeEach(() => {
    assert(counter === 2);
  });

  it('shows as passed', () => {
    assert.equal(1, 1);
    counter -= 1;
  });

  it('this one doesnt run', () => {
    assert.equal(2, 1);
  });
});

describe('After each flaky hook failure', function () {
  let counter = 2;

  afterEach(() => {
    assert(counter === 2);
  });

  it('shows as failed', () => {
    assert.equal(2, 1);
  });

  it('shows as passed', () => {
    assert.equal(1, 1);
    counter -= 1;
  });

  // this test never displays because the after hook failed
  it('show as passed 2', () => {
    assert.equal(2, 1);
    counter += 1;
  });

  it('doesnt run or show', () => {
    assert.equal(2, 1);
  });
});

describe('Same name test', () => {
  describe('hello', () => {
    beforeEach(() => {
      assert.equal(1, 1);
    });

    it('hello test', () => {
      assert.equal(1, 1);
    });
  });

  describe('hello', () => {
    beforeEach(() => {
      assert.equal(1, 1);
    });

    it('hello it test', () => {
      assert.equal(1, 1);
    });

    it('hello B', () => {
      assert.equal(2, 1);
    });

    describe('hello', () => {
      it('hello b', () => {
        assert.equal(1, 1);
      });

      it.skip('silent', () => {
        assert.equal(1, 1);
      });
    });

    describe('hello', () => {
      beforeEach(() => {
        throw new Error('hello error');
      });

      it('this case never runs', () => {
        assert.equal(2, 1);
      });

      it('this case will not be recorded', () => {
        assert.equal(2, 1);
      });
    });
  });
});
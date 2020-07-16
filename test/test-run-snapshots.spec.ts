import * as mockDate from 'jest-date-mock';
import { createReport } from './utils/create-report';
import { sampleCalls, demoFruitCalls, CallSequence } from './utils/reporter-test-calls';

// Don't put the entire snapshot in quotes, forcing quote content to be escaped
expect.addSnapshotSerializer({ serialize: (val) => val, test: (val) => typeof val === 'string' });

beforeEach(() => {
  mockDate.advanceTo('2077-03-14T03:14:15.926Z');
});

afterEach(() => {
  mockDate.clear();
});

describe('Regression testing ', () => {
  function expectSnapshotMatch(calls: CallSequence) {
    const actual = createReport(calls)
      .replace(/<filePath>.*?<\/filePath>/g, '<filePath>FILE_PATH</filePath>')
      .replace(/\((.+?)(:\d+:\d+)\)/g, ($0, $1, $2) => `(FILE_PATH${$2})`);
    expect(actual).toMatchSnapshot();
  }

  it('should match for the example data used by the official TestCafe reporters', function () {
    expectSnapshotMatch(sampleCalls);
  });

  it('should match for data copied from a test run with quarantine mode on', function () {
    expectSnapshotMatch(demoFruitCalls);
  });
});

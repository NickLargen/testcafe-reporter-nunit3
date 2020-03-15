import * as mockDate from 'jest-date-mock';
import { createReport } from './utils/create-report';
import { sampleCalls, demoFruitCalls } from './utils/reporter-test-calls';

// Don't put the entire snapshot in quotes, forcing quote content to be escaped
expect.addSnapshotSerializer({ serialize: val => val, test: val => typeof val === 'string' });

beforeEach(() => {
  mockDate.advanceTo('2077-03-14T03:14:15.926Z');
});

afterEach(() => {
  mockDate.clear();
});

describe('Regression testing ', () => {
  it('should match for the example data used by the official TestCafe reporters', function() {
    expect(createReport(sampleCalls)).toMatchSnapshot();
  });

  it('should match for data copied from a test run with quarantine mode on', function() {
    expect(createReport(demoFruitCalls)).toMatchSnapshot();
  });
});

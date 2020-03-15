import template from './template';
import { CallsiteRecord } from 'callsite-record';

type ResultOption = 'Passed' | 'Failed' | 'Skipped' | 'Inconclusive';

export default function() {
  return {
    noColors: true,
    taskData: null,

    reportTaskStart(startTime: Date, userAgents: string[], testCount: number) {
      this.taskData = new TaskData(startTime.toISOString());
    },

    reportFixtureStart(name: string, path: string, meta: Metadata) {
      this.taskData.handleFixtureStart(this.escapeHtml(name), path, meta);
    },

    // Optional
    reportTestStart(name: string, meta: Metadata) {
      this.taskData.handleTestStart(name, meta);
    },

    reportTestDone(name: string, testRunInfo: TestRunInfo, meta: Metadata) {
      const errorDetails = testRunInfo.errs.map(err => this.formatError(err, '-- ')).join('\n\n') || '';
      // Screenshot paths are included as attachments
      const withoutScreenshot = errorDetails.replace(/^\s*Screenshot:.*\n/gm, '');
      // Prevent well meaning trim()s from disturbing the formatting
      const u2800SpacingHack = withoutScreenshot.replace(/^( *) ([> ] \d+ \|)/gm, '$1⠀$2').replace(/\n\n/g, '\n⠀\n');
      this.taskData.handleTestDone(this.escapeHtml(name), testRunInfo, meta, u2800SpacingHack);
    },

    reportTaskDone(endTime: Date, passed: number, warnings: string[], result: TaskResult) {
      this.taskData.handleTaskDone(endTime.toISOString(), passed, warnings, result);

      this.write(template(this.taskData));
    },
  };
}

class TaskData {
  fixtures: FixtureData[];
  currentFixture: FixtureData;
  endTime: string;

  constructor(public startTime: string) {
    this.fixtures = [];
  }

  handleFixtureStart(name: string, path: string, meta: Metadata) {
    // TestCafe doesn't report a new fixtureStart until all of the tests in the previous fixture have completed. This can make test durations inaccurate when running with concurrency as test end time isn't marked until after all tests in the previous fixture have completed.
    this.currentFixture = new FixtureData(name, path, meta);
    this.fixtures.push(this.currentFixture);
  }

  handleTestStart(name: string, meta: Metadata) {}

  handleTestDone(name: string, testRunInfo: TestRunInfo, meta: Metadata, formattedErrorMessage: string = '') {
    this.currentFixture.endTime = new Date().toISOString();
    this.currentFixture.testCases.push(new TestCaseData(name, testRunInfo, meta, formattedErrorMessage));
  }

  handleTaskDone(endTime: string, passed: number, warnings: string[], result: TaskResult) {
    this.endTime = endTime;
  }
}

class FixtureData {
  testCases: TestCaseData[];
  startTime: string;
  endTime: string;

  constructor(public name: string, public path: string, private meta: Metadata) {
    this.startTime = new Date().toISOString();
    this.testCases = [];
  }
}

class TestCaseData {
  result: ResultOption;
  errorMessage: string;
  duration: number;
  hasFailureData: boolean;
  constructor(public name: string, public testRunInfo: TestRunInfo, private meta: Metadata, public formattedErrorMessage: string) {
    this.result = testRunInfo.skipped ? 'Skipped' : testRunInfo.errs.length > 0 ? 'Failed' : testRunInfo.unstable ? 'Inconclusive' : 'Passed';
    this.errorMessage = testRunInfo.errs.map(err => err.errMsg).join('\n');

    if (testRunInfo.quarantine && Object.entries(testRunInfo.quarantine).length > 1) {
      if (this.errorMessage) {
        this.errorMessage += '\n\n';
      }
      this.errorMessage += Object.entries(testRunInfo.quarantine)
        .map(([runNumber, passedObject]) => `Run ${runNumber}: ${passedObject.passed ? 'Passed' : 'Failed'}`)
        .join('\n');
    }

    if (testRunInfo.warnings && testRunInfo.warnings.length > 0) {
      this.formattedErrorMessage += '\n' + testRunInfo.warnings.join('\n');
    }

    this.duration = testRunInfo.durationMs / 1000;
    this.hasFailureData = !!this.errorMessage || !!this.formattedErrorMessage;
  }
}

interface TestRunInfo {
  errs: TestCafeError[];
  warnings: string[];
  durationMs: number;
  unstable: boolean;
  screenshotPath: string;
  screenshots: Screenshot[];
  quarantine: Quarantine;
  skipped: boolean;
}

interface Screenshot {
  screenshotPath: string;
  thumbnailPath: string;
  userAgent: string;
  quarantineAttempt: number;
  takenOnFail: boolean;
}

interface Quarantine {
  /** 1 indexed */
  [attemptNumber: number]: {
    passed: boolean;
  };
}

interface TaskResult {
  passedCount: number;
  failedCount: number;
  skippedCount: number;
}

interface Metadata {
  [key: string]: string;
}

interface TestCafeError {
  userAgent: string;
  screenshotPath: string;
  testRunPhase: string;
  code: string;
  isTestCafeError: boolean;
  callsite: CallsiteRecord;
  errMsg: string;
}

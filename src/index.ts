import { CallsiteRecord } from 'callsite-record';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

const template = Handlebars.compile(readFileSync(path.join(__dirname, 'template.handlebars'), 'utf-8'));

type ResultOption = 'Passed' | 'Failed' | 'Skipped' | 'Inconclusive';

export = function () {
  return {
    noColors: true,
    taskData: null as unknown as TaskData,
    cleanupPrematureExit: null as unknown as () => void | null,

    addFailedCompletionCheck() {
      const completionCheckName = 'TEST RAN TO COMPLETION CHECK';
      this.taskData.handleTestStart(completionCheckName, {});
      this.taskData.handleTestDone(
        completionCheckName,
        {
          durationMs: 0,
          errs: [{} as any],
          quarantine: [],
          screenshotPath: '',
          skipped: false,
          unstable: false,
          warnings: [],
        },
        {},
        'Process exited prior to all tests finishing.'
      );
    },

    writeAllData() {
      (this as any).write(template(this.taskData));
    },

    reportTaskStart(startTime: Date, userAgents: string[], testCount: number) {
      this.taskData = new TaskData(startTime.toISOString());

      this.cleanupPrematureExit = () => {
        this.addFailedCompletionCheck();
        this.writeAllData();
      };
      process.on('exit', this.cleanupPrematureExit);
    },

    reportFixtureStart(name: string, path: string, meta: Metadata) {
      this.taskData.handleFixtureStart((this as any).escapeHtml(name), path, meta);
    },

    // Optional
    reportTestStart(name: string, meta: Metadata) {
      this.taskData.handleTestStart(name, meta);
    },

    reportTestDone(name: string, testRunInfo: TestRunInfo, meta: Metadata) {
      const errorDetails = testRunInfo.errs.map((err) => (this as any).formatError(err, '❌ ')).join('\n\n') || '';
      // Screenshot paths are included as attachments
      const withoutScreenshot = errorDetails.replace(/^\s*Screenshot:.*\n?$/gm, '');
      // Prevent well meaning trim()s from disturbing the formatting
      const u2800SpacingHack = withoutScreenshot
        .replace(/^[^\S\r\n][^\S\r\n]([\s\d>]+\|)/gm, ($0, $1, $2) => '\u2800' + $1)
        .replace(/\n\n/g, '\n\u2800\n');

      this.taskData.handleTestDone((this as any).escapeHtml(name), testRunInfo, meta, u2800SpacingHack);
    },

    reportTaskDone(endTime: Date, passed: number, warnings: string[], result: TaskResult) {
      this.taskData.handleTaskDone(endTime.toISOString(), passed, warnings, result);

      process.off('exit', this.cleanupPrematureExit);
      this.writeAllData();
    },
  };
};

class TaskData {
  fixtures: FixtureData[];
  currentFixture!: FixtureData;
  endTime?: string;

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
  endTime?: string;
  hasMetadata: boolean;

  constructor(public name: string, public path: string, private meta: Metadata) {
    this.startTime = new Date().toISOString();
    this.testCases = [];
    this.hasMetadata = this.meta && Object.keys(this.meta).length > 0;
  }
}

class TestCaseData {
  result: ResultOption;
  errorMessage: string;
  duration: number;
  hasFailureData: boolean;
  hasMetadata: boolean;
  attachmentPaths?: string[];
  constructor(public name: string, public testRunInfo: TestRunInfo, private meta: Metadata, public formattedErrorMessage: string) {
    this.result = testRunInfo.skipped ? 'Skipped' : testRunInfo.errs.length > 0 ? 'Failed' : testRunInfo.unstable ? 'Inconclusive' : 'Passed';
    this.errorMessage = this.formattedErrorMessage.replace(/[\s\u2800]*Browser.*?([\n\u2800]*❌|$)/gs, ($0, $1) => $1);

    if (testRunInfo.screenshots) {
      this.attachmentPaths = testRunInfo.screenshots.map((screenshot) => screenshot.screenshotPath);
    }
    if (testRunInfo.videos) {
      this.attachmentPaths = (this.attachmentPaths ?? []).concat(testRunInfo.videos.map((video) => video.videoPath));
    }

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
    this.hasMetadata = this.meta && Object.keys(this.meta).length > 0;
  }
}

interface TestRunInfo {
  errs: TestCafeError[];
  warnings: string[];
  durationMs: number;
  unstable: boolean;
  screenshotPath: string;
  screenshots?: Screenshot[];
  videos?: Video[];
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

interface Video {
  videoPath: string;
  singleFile: boolean;
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
}

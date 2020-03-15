const TestRunErrorFormattableAdapter = require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter;
const UncaughtErrorOnPage = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage;
const ActionElementNotFoundError = require('testcafe').embeddingUtils.testRunErrors.ActionElementNotFoundError;
const testCallsite = require('./test-callsite');

function makeErrors(errDescrs: Array<ErrorDescription>) {
  return errDescrs.map(function(descr) {
    return new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo);
  });
}

const longSelector = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

export type CallSequence = Array<{ method: string; args: Array<any> }>;
export type ErrorDescription = { err: any; metaInfo: { [key: string]: any } };

export const sampleCalls: CallSequence = [
  {
    method: 'reportTaskStart',
    args: [new Date('1970-01-01T00:00:00.000Z'), ['Chrome 41.0.2227 / Mac OS X 10.10.1', 'Firefox 47 / Mac OS X 10.10.1'], 7],
  },
  {
    method: 'reportFixtureStart',
    args: ['First fixture', './fixture1.js'],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in first fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: true,
        screenshotPath: '/screenshots/1445437598847',
        screenshots: [
          {
            screenshotPath: 'C:/screenshots/1445437598847/1.png',
            userAgent: 'Chrome',
            quarantineAttempt: 1,
            takenOnFail: false,
          },
          {
            screenshotPath: 'C:/screenshots/1445437598847/2.png',
            userAgent: 'Firefox',
            quarantineAttempt: 1,
            takenOnFail: false,
          },
        ],
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Second test in first fixture',
      {
        errs: makeErrors([
          {
            err: new UncaughtErrorOnPage('Some error', 'http://example.org'),

            metaInfo: {
              userAgent: 'Chrome 41.0.2227 / Mac OS X 10.10.1',
              screenshotPath: '/screenshots/1445437598847/errors',
              callsite: testCallsite,
              testRunPhase: 'inTest',
            },
          },
          {
            err: new ActionElementNotFoundError({
              apiFnChain: [longSelector, 'one', 'two', 'three'],
              apiFnIndex: 1,
            }),

            metaInfo: {
              userAgent: 'Firefox 47 / Mac OS X 10.10.1',
              callsite: testCallsite,
              testRunPhase: 'inTest',
            },
          },
        ]),

        durationMs: 74000,
        unstable: false,
        screenshotPath: '/screenshots/1445437598847',
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Third test in first fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
      },
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['Second fixture', './fixture2.js'],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in second fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Second test in second fixture',
      {
        errs: [],
        durationMs: 74000,
        unstable: false,
        screenshotPath: null,
      },
    ],
  },
  {
    method: 'reportTestDone',
    args: [
      'Third test in second fixture',
      {
        errs: [],
        durationMs: 0,
        unstable: false,
        screenshotPath: null,
        skipped: false,
      },
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['Third fixture', './fixture3.js'],
  },
  {
    method: 'reportTestDone',
    args: [
      'First test in third fixture',
      {
        errs: makeErrors([
          {
            err: new ActionElementNotFoundError({
              apiFnChain: [longSelector, 'one', 'two', 'three'],
              apiFnIndex: 1,
            }),

            metaInfo: {
              userAgent: 'Firefox 47 / Mac OS X 10.10.1',
              callsite: testCallsite,
              testRunPhase: 'inTestBeforeHook',
            },
          },
        ]),

        durationMs: 74000,
        unstable: true,
        screenshotPath: null,
      },
    ],
  },
  {
    method: 'reportTaskDone',
    args: [
      new Date('1970-01-01T00:15:25.000Z'),
      4,
      [
        'Was unable to take a screenshot due to an error.\n\nReferenceError: someVar is not defined',
        'Was unable to take a screenshot due to an error.\n\nReferenceError: someOtherVar is not defined',
        'Was unable to take screenshots because the screenshot directory is not specified. To specify it, use the "-s" or "--screenshots" command line option or the "screenshots" method of the test runner in case you are using API.',
      ],
      { passedCount: 0, failedCount: 0, skippedCount: 0 },
    ],
  },
];

export const demoFruitCalls: CallSequence = [
  {
    method: 'reportTaskStart',
    args: [new Date('1970-03-14T15:27:12.448Z'), ['Chrome 80.0.3987.132 / Windows 10'], 4],
  },
  {
    method: 'reportFixtureStart',
    args: ['Banana', 'C:\\testcafe-demo\\test\\all.spec.ts', {}],
  },
  {
    method: 'reportTestStart',
    args: ['Split', {}],
  },
  {
    method: 'reportTestDone',
    args: [
      'Split',
      {
        errs: makeErrors([
          {
            metaInfo: {
              userAgent: 'Chrome 80.0.3987.132 / Windows 10',
              screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\1_run-3_Chrome.png',
              testRunPhase: 'inTest',
              code: 'E53',
              isTestCafeError: true,
              callsite: {
                filename: 'C:\\testcafe-demo\\test\\all.spec.ts',
                lineNum: 26,
                callsiteFrameIdx: 6,
                stackFrames: [],
                isV8Frames: true,
              },
            },
            err: new UncaughtErrorOnPage("AssertionError: expected '41' to deeply equal '7'", 'http://example.org'),
          },
        ]),
        warnings: [],
        durationMs: 17200,
        unstable: false,
        screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors',
        screenshots: [
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\1_run-1_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\thumbnails\\1_run-1_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 1,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\1_run-2_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\thumbnails\\1_run-2_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 2,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\1_run-3_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-1\\errors\\thumbnails\\1_run-3_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 3,
            takenOnFail: true,
          },
        ],
        quarantine: {
          '1': {
            passed: false,
          },
          '2': {
            passed: false,
          },
          '3': {
            passed: false,
          },
        },
        skipped: false,
      },
      {},
    ],
  },
  {
    method: 'reportTestStart',
    args: ['Costume', {}],
  },
  {
    method: 'reportTestDone',
    args: [
      'Costume',
      {
        errs: makeErrors([
          {
            metaInfo: {
              userAgent: 'Chrome 80.0.3987.132 / Windows 10',
              screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\1_run-3_Chrome.png',
              testRunPhase: 'inTest',
              code: 'E53',
              isTestCafeError: true,
              callsite: testCallsite,
            },
            err: new UncaughtErrorOnPage('AssertionError: expected false to be truthy', 'http://example.org'),
          },
        ]),
        warnings: [],
        durationMs: 15978,
        unstable: false,
        screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors',
        screenshots: [
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\1_run-1_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\thumbnails\\1_run-1_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 1,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\1_run-2_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\thumbnails\\1_run-2_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 2,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\1_run-3_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-2\\errors\\thumbnails\\1_run-3_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 3,
            takenOnFail: true,
          },
        ],
        quarantine: {
          '1': {
            passed: false,
          },
          '2': {
            passed: false,
          },
          '3': {
            passed: false,
          },
        },
        skipped: false,
      },
      {},
    ],
  },
  {
    method: 'reportFixtureStart',
    args: ['Pear', 'C:\\testcafe-demo\\test\\all.spec.ts', {}],
  },
  {
    method: 'reportTestStart',
    args: ['Fast', {}],
  },
  {
    method: 'reportTestDone',
    args: [
      'Fast',
      {
        errs: [],
        warnings: [],
        durationMs: 716,
        screenshotPath: null,
        screenshots: [],
        quarantine: {
          '1': {
            passed: true,
          },
        },
        skipped: false,
      },
      {},
    ],
  },
  {
    method: 'reportTestStart',
    args: ['Faster', {}],
  },
  {
    method: 'reportTestDone',
    args: [
      'Faster',
      {
        errs: makeErrors([
          {
            metaInfo: {
              userAgent: 'Chrome 80.0.3987.132 / Windows 10',
              screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\1_run-3_Chrome.png',
              testRunPhase: 'inTest',
              code: 'E53',
              isTestCafeError: true,
              callsite: {
                filename: 'C:\\testcafe-demo\\test\\all.spec.ts',
                lineNum: 39,
                callsiteFrameIdx: 6,
                isV8Frames: true,
              },
            },
            err: new UncaughtErrorOnPage("AssertionError: expected '41' to deeply equal '5'", 'http://example.org'),
          },
        ]),
        warnings: [],
        durationMs: 16582,
        unstable: false,
        screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors',
        screenshots: [
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\1_run-1_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\thumbnails\\1_run-1_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 1,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\1_run-2_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\thumbnails\\1_run-2_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 2,
            takenOnFail: true,
          },
          {
            screenshotPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\1_run-3_Chrome.png',
            thumbnailPath: 'C:\\testcafe-demo\\screenshots\\1970-03-14_11-27-11\\test-4\\errors\\thumbnails\\1_run-3_Chrome.png',
            userAgent: 'Chrome_80.0.3987.132_Windows_10',
            quarantineAttempt: 3,
            takenOnFail: true,
          },
        ],
        quarantine: {
          '1': {
            passed: false,
          },
          '2': {
            passed: false,
          },
          '3': {
            passed: false,
          },
        },
        skipped: false,
      },
      {},
    ],
  },
  {
    method: 'reportTaskDone',
    args: [
      new Date('1970-03-14T15:28:03.175Z'),
      1,
      [],
      {
        passedCount: 1,
        failedCount: 3,
        skippedCount: 0,
      },
    ],
  },
];

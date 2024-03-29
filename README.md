# testcafe-reporter-nunit3

![Release](https://github.com/NickLargen/testcafe-reporter-nunit3/workflows/Release/badge.svg?branch=master)

This is the **NUnit 3** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe). It currently implements the [subset of attributes](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/test/publish-test-results?view=azure-devops&tabs=yaml#result-formats-mapping) that Azure DevOps cares about and has not been tested for other scenarios.

Details of the NUnit format can be found at https://github.com/nunit/docs/wiki/Test-Result-XML-Format.

### Features:

- Video and screenshot paths included as test case attachments.
- Quarantine mode support: passing tests that failed at least once are marked as `Inconclusive` instead of `Passed`. The result of each run is specified as text appended to the error message.
- Fails the test run (via a new failed test case) if the TestCafe process exits without all tests finishing. The provided xunit reporter emits a blank file in these scenarios.
- Emits [fixture and test metadata](https://testcafe.io/documentation/403436/guides/intermediate-guides/metadata-and-filtering) as `<property>` elements.

Error details for every failed quarantine run are not currently supported by the TestCafe Reporter API.

## Install

```sh
npm install testcafe-reporter-nunit3
```

## Usage

An example `.testcaferc.json` entry that creates nunit3 reports along with standard console logging:

```json
"reporter": [
    "spec",
    {
      "name": "nunit3",
      "output": "results/handy-dandy-report.xml"
    }
  ]
```

See [the official reporter documentation](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/reporters.html#using-the-reporters) for more information.

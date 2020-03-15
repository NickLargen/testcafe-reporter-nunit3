import { CallSequence } from './reporter-test-calls';

const buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
const pluginFactory = require('../../lib');

export function createReport(reporterTestCalls: CallSequence) {
  const outStream = {
    data: '',

    write: function(text: string) {
      this.data += text;
    },
  };

  const plugin = buildReporterPlugin(pluginFactory, outStream);

  reporterTestCalls.forEach(function(call) {
    plugin[call.method].apply(plugin, call.args);
  });

  // Mock stack entries for test run consistency
  return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');
}

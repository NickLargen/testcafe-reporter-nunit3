var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
var pluginFactory = require('../../lib');

export function createReport(reporterTestCalls: Array<{ method: string; args: Array<any> }>) {
  var outStream = {
    data: '',

    write: function(text) {
      this.data += text;
    },
  };

  var plugin = buildReporterPlugin(pluginFactory, outStream);

  reporterTestCalls.forEach(function(call) {
    plugin[call.method].apply(plugin, call.args);
  });

  // Mock stack entries for test run consistency
  return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)');
}

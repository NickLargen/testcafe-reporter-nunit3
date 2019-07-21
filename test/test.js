const assert = require('assert');
const normalizeNewline = require('normalize-newline');
const read = require('read-file-relative').readSync;
const createReport = require('./utils/create-report');

function stripDynamicDates(str) {
    return str.replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/g, '');
}

it('Should produce a report matching the previous snapshot', function() {
    let report = createReport(false);
    let expected = read('./data/report-without-colors');

    report = stripDynamicDates(normalizeNewline(report)).trim();
    expected = stripDynamicDates(normalizeNewline(expected)).trim();

    assert.strictEqual(report, expected);
});

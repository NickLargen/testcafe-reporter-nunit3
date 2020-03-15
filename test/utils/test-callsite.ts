import createCallsiteRecord = require('callsite-record');

function functionThatThrowsUp() {
  throw new Error('Hey ya!');
}

try {
  functionThatThrowsUp();
} catch (err) {
  module.exports = createCallsiteRecord({
    forError: err,
    processFrameFn: frame => {
      frame.fileName = frame.fileName.replace(process.cwd(), '.');
      return frame;
    },
  });
}

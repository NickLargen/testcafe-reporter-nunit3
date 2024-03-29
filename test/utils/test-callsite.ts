import * as createCallsiteRecord from 'callsite-record';

export let testCallsiteVariableLineNumberLength: any, testCallsiteAllLinesTwoDigitNumbers: any;

// ----- Avoid changing the contents of this file, they constitute mock failure locations ---- \\

function functionThatThrowsUp() {
  throw new Error('Hey ya!');
}

try {
  functionThatThrowsUp();
} catch (err: any) {
  testCallsiteVariableLineNumberLength = createCallsiteRecord({ forError: err });
}

const functionThatThrowsDown = () => {
  throw Error('Wilson!');
};

try {
  functionThatThrowsDown();
} catch (err: any) {
  testCallsiteAllLinesTwoDigitNumbers = createCallsiteRecord({ forError: err });
}

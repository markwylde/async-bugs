const chalk = require('chalk');
const path = require('path');
const chain = require('stack-chain');
const asyncHooks = require('async_hooks');

const appDir = require.main
  ? path.dirname(require.main.filename) + '/'
  : path.dirname(process.argv[1]);

const executionScopeInits = new Set();
const traces = new Map();

const hooks = asyncHooks.createHook({
  init: asyncInit
});
hooks.enable();

process.fullStackTrace = []
process.on('unhandledRejection', function (error) {
  const traces = process.fullStackTrace
    .sort()
    .reverse()
    .map(line => '    ' + line.slice(line.indexOf(']') + 1))
    .map(line => {
      if (!line.includes('node_modules')) {
        if (appDir) {
          line = line.split(appDir);
          line[1] = chalk.bold(line[1]);
          line = line.join(appDir) + ')';

          line = line.replace(appDir, chalk.grey(appDir));
        }
        return line
      } else {
        return chalk.grey(line);
      }
    })

  const uniqueTraces = Array.from([...new Set(traces)])
    .join('\n');
  console.log(error);
  console.log(uniqueTraces);
})

function asyncInit(asyncId, type, triggerAsyncId, resource) {
  const trace = chain.callSite({
    extend: false,
    filter: true,
    slice: 2
  })

  if (executionScopeInits.has(triggerAsyncId)) {
    const parentTrace = traces.get(triggerAsyncId);

    let i = parentTrace.length;
    while(i-- && trace.length > 1) {
      const a = parentTrace[i]
      const aFile = a.getFileName();
      const aLine = a.getLineNumber();
      const aColumn = a.getColumnNumber();

      if (aFile === null || aLine === null || aColumn === null) {
        return false;
      }

      process.fullStackTrace.push(
          `[${100000000 + triggerAsyncId}] at ${a.getFunctionName()} (${aFile}:${aLine}:${aColumn}`
      )
    }
  }

  traces.set(asyncId, trace);

  executionScopeInits.add(asyncId);
}

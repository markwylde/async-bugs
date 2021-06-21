| :exclamation:  [hazlines](https://github.com/markwylde/hazlines) has replaced this and handles more scenarios  |
|-------------------------------------------------------------------------------------|

# async-bugs
Create fuller stacktraces, remove all internal lines and gray out modules.

You probably don't want to run this in production. It's great for development and testing, but
in production it will slow your app down a great deal.

## Example Conditional Require
```javascript
if (process.env.NODE_ENV !== 'production') {
  require('async-bugs')
}
```

## Modes
### Normal
The normal mode uses `trace` and `trace-cleaner` to give you stack traces that are organised
and minimised to only the stacks still in scope.

### Verbose
There are some cases the normal mode can not handle. For example if you are doing some crazy
Error extending and it still loses the stack trace. In that case, the verbose mode simple logs
every async call and outputs it on error. It'll be long, but the call should be there.

## Installation
```bash
npm install --save async-bugs
```

## Example Usage
Include in your app:

### Normal
```javascript
require('async-bugs')
```

### Verbose
```javascript
require('async-bugs/verbose')
```

Or add when running node:

### Normal
```bash
node -r async-bugs
```

### Verbose
```bash
node -r async-bugs/verbose
```

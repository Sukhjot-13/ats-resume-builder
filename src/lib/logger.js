const isDevelopment = process.env.NODE_ENV === 'development';

const colors = {
  info: '34', // blue
  debug: '32', // green
  warn: '33', // yellow
  error: '31', // red
};

const serializeError = (err) => ({
  name: err.name,
  message: err.message,
  stack: err.stack,
  ...err,
});

const log = (level, ...args) => {
  if (level === 'debug' && !isDevelopment) {
    return;
  }

  let [obj, ...msgParts] = args;

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    msgParts.unshift(obj);
    obj = {};
  }

  const msg = msgParts.map(part => {
    if (part instanceof Error) return part.stack || part.message;
    if (typeof part === 'object' && part !== null) return JSON.stringify(part);
    return part;
  }).join(' ');

  if (isDevelopment) {
    const color = colors[level] || '37';
    const timestamp = new Date().toLocaleTimeString();
    let logMsg = `[${color}m[${timestamp}] ${level.toUpperCase()}[0m`;
    if (msg) logMsg += ` ${msg}`;
    
    const serializedObj = {};
    for (const key in obj) {
      const value = obj[key];
      serializedObj[key] = value instanceof Error ? serializeError(value) : value;
    }

    if (Object.keys(serializedObj).length > 0) {
      logMsg += `
${JSON.stringify(serializedObj, null, 2)}`;
    }
    console[level](logMsg);
  } else {
    const logObject = {
      level,
      timestamp: new Date().toISOString(),
    };

    for (const key in obj) {
      const value = obj[key];
      logObject[key] = value instanceof Error ? serializeError(value) : value;
    }
    
    if (msg) logObject.msg = msg;

    console[level](JSON.stringify(logObject));
  }
};

const logger = {
  info: (...args) => log('info', ...args),
  debug: (...args) => log('debug', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};

export default logger;

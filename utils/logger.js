const { createLogger, format, transports } = require('winston');
const { MongoDB } = require('winston-mongodb');

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
  
const logger = createLogger({
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    // - Write to all logs with level `info` and below to `combined.log` 
    new transports.File({ filename: 'log.log', level: 'warn' }),
    new transports.File({ filename: 'info.log', level: 'info' }),
    new transports.Console(),
    new MongoDB({db : process.env.DATABASE_URL , collection : 'log', level : 'warn'}),
  ],
});
module.exports = logger;
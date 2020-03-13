const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}]: ${message}`;
});
  
const logger = createLogger({
	level: 'info',
	format: combine(timestamp(), myFormat),
	defaultMeta: { service: 'user-service' },
	transports: [
		// - Write to all logs with level `info` and below to `combined.log` 
		new transports.File({ filename: 'log.log' })
	]
});
module.exports = logger;
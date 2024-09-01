// logger.js
import * as winston from 'winston';

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.colorize(), // Add colors to the log output
    winston.format.timestamp(), // Add timestamp to each log entry
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize the log output for the console
        winston.format.simple(), // Simple format without timestamps
      ),
    }),
  ],
});

export { logger };

import pino, { type LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const pinoOptions: LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  // Safely spread the transport configuration in development
  ...(!isProduction && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        // Adds a readable timestamp to dev logs
        translateTime: 'SYS:standard', 
        ignore: 'pid,hostname', 
      },
    },
  }),
};

export const logger = pino(pinoOptions);
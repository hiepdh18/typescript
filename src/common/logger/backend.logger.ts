import chalk from 'chalk';
import { REQUEST_ID, SESSION_USER } from '../constant/constants';
// import { SessionMiddleware } from 'common/middleware/session.middleware';
import dayjs from 'dayjs';
// import { User } from 'modules/user/schemas/user.schema';
import * as winston from 'winston';
// import ecsFormat from '@elastic/ecs-winston-format';
import 'winston-daily-rotate-file';

const formatter = (info: any) => {
  // const requestId = SessionMiddleware.get(REQUEST_ID) || '-';
  // const user = SessionMiddleware.get(SESSION_USER);
  // const email = user ? user.email : '-';
  // return `${chalk.magentaBright()}  [${info.level}] [${chalk.green(info.context)}] ${info.message}`;
  return `${dayjs(info.timestamp).format('YYYY/MM/DD - hh:mm:ss A')} hiepdh18@gmail.com [${
    info.level
  }] [${info.context}] ${info.message}`;
  //  return `${dayjs(info.timestamp).format('YYYY/MM/DD - hh:mm:ss A')} ${chalk.magentaBright(
  //    requestId,
  //  )} ${email} [${info.level}] [${chalk.green(info.context)}] ${info.message}`;
};

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf((info: any) => formatter(info)),
);

export class BackendLogger {
  public static winstonLogger = winston.createLogger({
    level: 'error',
    format: customFormat,
    // format: ecsFormat(),
    transports: [
      new winston.transports.DailyRotateFile({
        filename: 'logs/server.log',
        format: winston.format.combine(winston.format.uncolorize()),
        level: 'warn',
        datePattern: 'YYYY-MM-DD',
        maxFiles: 10,
      }),
      // new winston.transports.DailyRotateFile({
      //   filename: 'logs/serverAll.log',
      //   format: winston.format.combine(winston.format.uncolorize()),
      //   level: 'silly',
      //   datePattern: 'YYYY-MM-DD',
      //   maxFiles: 10,
      // }),

      // new winston.transports.File({
      //   filename: 'logs/serverAll.log',
      //   format: winston.format.combine(winston.format.uncolorize()),
      //   tailable: false,
      //   level: 'silly',
      //   maxFiles: 30,
      //   maxsize: 5 * 1024 * 1024, // 5 MB
      // }),
      // new winston.transports.DailyRotateFile({
      //   filename: 'logs/combined-%DATE%.log',
      //   level: 'error',
      //   datePattern: 'YYYY-MM-DD-HH',
      //   frequency: '72h',
      //   maxFiles: 1,
      // }),
    ],
  });

  private ctx: string;

  constructor(context: string) {
    // super(context);

    this.ctx = context;
  }

  winstonLog(
    message: string,
    level: 'silly' | 'verbose' | 'debug' | 'warn' | 'error',
    trace?: string,
  ) {
    BackendLogger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
    });
  }

  silly(message: string) {
    this.winstonLog(message, 'silly');
    // super.log(message);
  }

  debug(message: string) {
    this.winstonLog(message, 'debug');
    // super.log(message);
  }

  log(message: string) {
    this.winstonLog(message, 'verbose');
    // super.log(message);
    console.log(message);
  }

  warn(message: string) {
    this.winstonLog(message, 'warn');
    // super.warn(message);
  }

  error(message: string, trace: string) {
    this.winstonLog(message, 'error', trace);
    // super.error(message, trace);
  }
}

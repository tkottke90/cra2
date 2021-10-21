import { GenericDictionary } from "@classes/dictionary.class";
import { Inject, Service } from "typedi";
import { createLogger, format, Logger, transports, transport } from "winston";
import EnvironmentService from "./environment.service";
import lodash from 'lodash';

// Configurable list of levels
export const customList = [ 'fatal', 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'database', 'silly', 'setup' ] as const;
//                                                        ^
//                                                     default

type LogLevel = typeof customList[number];

export interface ILoggerConfigurations {
  levels: string[];
  transports: string[];
}

@Service()
export class LoggerClass {
  private logger: Logger;
  
  public instanceName: string = 'App';

  constructor(
    @Inject()
    private environmentService: EnvironmentService
  ) {
    this.logger = createLogger({
      levels: this.generateLogLevels(Array.from(customList)),
      level: 'setup',
      silent: this.environmentService.get('NODE_ENV') === 'testing',
      format: this.generateLogFormat(),
      transports: this.generateTransports()
    });
  }

  public createChildLogger(loggerName: string | string[]): ChildLogger {
    return new ChildLogger(loggerName, this);
  }

  public database(message: string, data: any = '') {
    this.log('database', message, data);
  }
  
  public error(error: Error, data: any = {}) {
    let metadata = data;
    if ((error as any).toJSON) {
      metadata = { ...metadata, ...(error as any).toJSON() };
    } else {
      metadata.stack = error.stack;
      metadata.name = error.name;
    }

    this.log('error', error.message, metadata);
  }

  public log(level: LogLevel, message: string, data: any = {}) {
    this.logger.log(level, message, data)
  }

  /**
   * Get the loggers configured levels and transports
   * @returns Object containing a list of levels and transports
   */
   public getConfiguration(): ILoggerConfigurations {
    return {
      levels: Object.keys(this.logger.levels),
      transports: this.logger.transports.map((t: any) => t.name)
    };
  }

  /**
   * Increase/Decrease the log level of the application
   * @param {LogLevel} level The severity of logs that should be displayed 
   * @param {string} transport The transport to update
   */
  public updateLogLevel(level: LogLevel, transport: string = '') {
    if (transport) {
      const _transport = this.logger.transports.find((t: any) => t.name === transport);
      if (!_transport) {
        throw new Error(`No transport found: ${transport}`);
      }

      _transport.level = level;
    } else {
      this.logger.transports.forEach((t: transport) => {
        t.level = level;
      });
    }
  }

  private generateLogLevels(levels: string[]) {
    return levels.reduce( (acc, cur, index) => Object.assign(acc, { [cur]: index }), {}); 
  }

  private generateLogFormat() {
    return format.combine(
      format.timestamp(),
      format.simple(),
      format.printf((info: GenericDictionary) => {
        const customFields = [ 'message', 'timestamp', 'level', 'instance' ];

        const { message, timestamp, level, instance } = lodash.pick(info, customFields);
        const metadata = lodash.omit(info, customFields);

        let stringifiedInfo;
        try {
          stringifiedInfo = JSON.stringify(metadata)
        } catch (error: any) {
          stringifiedInfo = { error: error.message, stack: error.stack }
        }

        // No need to record empty objects, they will just dirty up the logs
        if (stringifiedInfo === '{}') {
          stringifiedInfo = '';
        }

        return `${timestamp} | ${level} | ${instance || this.instanceName} | ${message} ${stringifiedInfo}`;
      })
    )
  }

  private generateTransports() {
    const isDevelopment = this.environmentService.get('IS_DEVELOPMENT') || false

    return [
      new transports.Console({ level: isDevelopment ? 'setup' : 'http' })
    ]
  }
}

export class ChildLogger {
  private logger: LoggerClass;
  private className: string;

  constructor(className: string | string[], logger: LoggerClass) {
    this.logger = logger;
    
    this.className = this.parseClassName(className);
  }

  /**
   * Submits a log that is then recorded to the configured locations
   * @param {LogLevel} level The severity of the log 
   * @param {String} message Description of the log 
   * @param {*} data Additional context about the log 
   */
  log(level: LogLevel, message: string, data: any = {}): void {
    data.instance = this.className;

    this.logger.log(level, message, data);
  }

  createChildLogger(className: string | string[]): ChildLogger {
    return new ChildLogger([ this.className, className ].flat(), this.logger);
  }

  private parseClassName(className: string | string[]): string {
    const cName = Array.isArray(className) ? className.join('.') : className;
    return `${this.logger.instanceName}.${cName}`;
  }
}
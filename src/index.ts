import 'reflect-metadata';
import app from './app';
import { createHttpTerminator } from 'http-terminator';
import { Container } from 'typedi';
import EnvironmentService from './services/environment.service';
import { LoggerClass } from './services/logger.service';

const environment = Container.get(EnvironmentService);
const logger = Container.get(LoggerClass);

const server = app.listen(environment.get('PORT'), () => {
  logger.log('info', `Server Start on Port ${environment.get('PORT')}`)
});
const httpTerminator = createHttpTerminator({ server });

process.on('uncaughtExceptionMonitor', (err: Error, origin: any) => {
  logger.log('fatal', err.message, { name: err.name, origin });
});

process.on('SIGINT', () => {
  httpTerminator.terminate();
});
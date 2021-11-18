import EnvironmentService from "@services/environment.service";
import { LoggerClass } from "@services/logger.service";
import { IRoute } from "./route.class";
import Container from "typedi";
import { BaseController } from "./base-route.class";

type MethodDecoratorFn = {
  (target: BaseController, propertyKey: string, descriptor: PropertyDescriptor): any
}

type DecoratorCallback = {
  (route: IRoute, target: BaseController, propertyKey: string, descriptor: PropertyDescriptor): any
}

export function RouteDecorator(callback: DecoratorCallback): MethodDecoratorFn {
  return function (target: BaseController, propertyKey: string, descriptor: PropertyDescriptor) {
    const route = target.routes.find((route: IRoute) => route.metadata.methodName === propertyKey);

    if (!route) {
      const message = `Error: Could not find Route.  Did you annotate the method with @Route()?`;
      const displayDetails: string[] = [
        `\t- Controller: ${target.constructor.name}`,
        `\t- Method: ${propertyKey}`
      ];
      
      return GenerateDecoratorError(message, displayDetails);
    }

    if (!route!.enabled) {
      const message = `WARN: Route is Disabled.`;
      const displayDetails: string[] = [
        `\t- Controller: ${target.constructor.name}`,
        `\t- Method: ${propertyKey}`
      ];
      
      return GenerateDecoratorError(message, displayDetails);
    }

    return callback(route, target, propertyKey, descriptor);
  }
}

export function GenerateDecoratorError(message: string, outputLines: string[]) {
  const env = Container.get(EnvironmentService);
    const logger = Container.get(LoggerClass);
  
  if (env.get('NODE_ENV') === 'development') {
    console.warn(` === Setup Error === \n\n${message}\n\n${outputLines.join('\n')}\n`);
  } else {
    logger.log('warn', message, { stdoutLines: outputLines });
  } 
}
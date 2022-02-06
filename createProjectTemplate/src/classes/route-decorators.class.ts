import { IRoute } from "./route.class";
import { BaseController } from "./base-controller.class";
import { GenerateDecoratorError } from '../errors/generate-decorator-error.class';

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
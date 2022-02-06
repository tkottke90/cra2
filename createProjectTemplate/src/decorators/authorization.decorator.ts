import { BaseController } from "../classes/base-controller.class";
import { RouteDecorator } from "../classes/route-decorators.class";
import { IRoute } from "../classes/route.class";

interface Configuration {
  verificationFn?: (user: any) => boolean
};

export function Authorization(options: Configuration = {}) {
  return RouteDecorator((route: IRoute, target: BaseController, propertyKey: string, descriptor: PropertyDescriptor) => {
    const config = Object.assign(route.authorization, options) as Configuration;
    
    route.authorization.required = true;
    route.authorization.verificationFn = config.verificationFn || route.authorization.verificationFn;
  })
}
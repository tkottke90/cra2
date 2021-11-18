import { RouteDecorator } from "@classes/route-decorators.class";
import { THookTypes, IHook } from "@classes/route.class";

export function Hooks(type: THookTypes, hooks: IHook[]) {
  return RouteDecorator((route, target, propertyKey, descriptor) => {
    route.hooks[type] = [ ...route.hooks[type], ...hooks];
  });
}
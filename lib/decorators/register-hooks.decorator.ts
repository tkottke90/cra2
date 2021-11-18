import { RouteDecorator } from "../core/route-decorators.class";
import { THookTypes, IHook } from "../core/route.class";

export function Hooks(type: THookTypes, hooks: IHook[]) {
  return RouteDecorator((route, target, propertyKey, descriptor) => {
    route.hooks[type] = [ ...route.hooks[type], ...hooks];
  });
}
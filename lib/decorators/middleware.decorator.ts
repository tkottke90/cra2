import { RequestHandler } from 'express'
import { RouteDecorator } from "@classes/route-decorators.class";

type MiddlewareLocation = 'before' | 'after';

export function Middleware(type: MiddlewareLocation, middleware: RequestHandler[]) {
  return RouteDecorator((route, target, propertyKey, descriptor) => {
    route.middleware[type] = [ ...route.middleware[type], ...middleware];
  });
}
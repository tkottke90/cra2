import { Application, NextFunction, Request, RequestHandler, Response } from "express";
import { BaseController } from "./base-controller.class";
import { GenerateDecoratorError } from '../errors/generate-decorator-error.class';

export type TRouteMethods = 'get' | 'post' | 'patch' | 'put' | 'delete' | 'options';
export type THookTypes = 'before' | 'after' | 'error';

export interface IContext {
  readonly request: Request;
  readonly response: Response;
  readonly next?: NextFunction,
  readonly app: Application;
  readonly params: Record<string, any>;
  readonly query: Record<string, any>;
  readonly transport: 'http' | 'socket',
  user: any;
  readonly method: string;
  data?: Record<string, any>;
  result?: any;
  error?: any;
}

export type IHook = (context: IContext) => IContext | Promise<IContext>;

interface RouteMetaData extends Record<string, any> {
  className: string,
  methodName: string,
  parameters: string[];
}

export interface IRoute {
  metadata: RouteMetaData;
  function: (...args: any[]) => any,
  method: TRouteMethods;
  path: string;
  middleware: {
    before: RequestHandler[];
    after: RequestHandler[];
  },
  hooks: {
    before: IHook[];
    after: IHook[];
    error: IHook[];
  };
  enabled: boolean;
  authorization: {
    required: boolean;
    verificationFn: (user: any) => boolean
  }
}

export function Route(options?: { path?: string, method?: TRouteMethods }) {
  return function (target: BaseController, propertyKey: string, descriptor: PropertyDescriptor) {
    const route = Object.assign(
      {
        authorization: {
          required: false,
          verificationFn: (user: any) => true
        },
        enabled: true,
        path: '/',
        method: 'get',
        middleware: {
          before: [],
          after: []
        },
        hooks: {
          before: [],
          after: [],
          error: []
        },
        function: descriptor.value,
        metadata: { className: target.constructor.name, methodName: propertyKey, parameters: [] }
      }, 
      options
    ) as IRoute;

    // Ensure Routes Map Exists On Object
    if (!target.routes) {
      target.routes = []
    }

    // Check for parameters and register those as well so we can inject them
    if (descriptor.value.length > 0) {
      const FN_ARGS = /[(](.*)[)]/m;
      const params = descriptor.value.toString().match(FN_ARGS)[1];
      
      route.metadata.parameters = params.split(/,\s?/);
    }


    // Ensure each route has a unique path
    const matchingRoutes = target.routes.filter(r => r.path === route.path && r.method === route.method);
    if (matchingRoutes.length >= 1) {
      const conflictingRoutes = matchingRoutes
        .filter(r => r.method === route.method && r.metadata.methodName !== propertyKey)
        .map((r: IRoute, index: number) => `${r.metadata.methodName} (${index})`)
        .join(',');

      const message = `Error: Route paths must be unique by method.  Found ${matchingRoutes.length} ${route.method.toUpperCase()} ${route.path}`;
      const displayDetails = [
        `\t- Controller: ${route.metadata.className}`,
        `\t- Method: ${propertyKey}`,
        `\t- Route: ${route.method.toUpperCase()} ${route.path}`,
        `\t- Conflicts (index): ${conflictingRoutes}`
      ];
      
      GenerateDecoratorError(message, displayDetails);

      route.enabled = false;
      target.routes.push(route);
    } else {
      target.routes.push(route);
    }

  }
}